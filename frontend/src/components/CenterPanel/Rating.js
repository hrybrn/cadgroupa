import React, { Component, Fragment } from 'react';
import { Chip, FormLabel } from '@material-ui/core';

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import ThumbsUp from '@material-ui/icons/ThumbUp';
import ThumbsDown from '@material-ui/icons/ThumbDown';

import { mapStatesToProps } from 'react-fluxible';

class Rating extends Component {
    render() {
        const { player } = this.props;

        return (
            
            <Chip onDelete={this.nothing} label={<FormLabel>{player.displayName}</FormLabel>} deleteIcon={<Vote player={player} rated={false} sendFeedback={this.sendFeedback.bind(this, player.userId)}/>}/>
        );
    }
    nothing(){}
    sendFeedback(recipientID, good) {
        this.props.mutate({ variables: { recipientID, good, token: this.props.user.token }});
    }
}
class Vote extends Component{
    state = {
        rated:this.props.rated,
        thumb: ''
    };
    render() {
        return (
            this.state.rated ?
                <Fragment>{this.state.thumb === 'up' ? <ThumbsUp /> : <ThumbsDown/>} &nbsp;<FormLabel>Sent!</FormLabel> &nbsp;&nbsp; </Fragment>
                
                :<Fragment>
                    <ThumbsUp type="button" onClick={() => this.sendFeedback(true)}></ThumbsUp>
                    &nbsp;
                    <ThumbsDown type="button" onClick={() => this.sendFeedback(false)}></ThumbsDown>
                    &nbsp;
                    &nbsp;
                </Fragment>
                
        );
    }
    sendFeedback(rating){
        this.props.sendFeedback(rating);
        this.setState({rated:true});
        rating ? this.setState({thumb:'up'}) : this.setState({thumb:'down'});
    }
}
const RatePlayer = gql`mutation RatePlayer($recipientID: String, $good: Boolean, $token: String){
    matchmaking {
        rate(recipientId: $recipientID, upvote: $good, token: $token)
    }
}`;

export default mapStatesToProps(graphql(RatePlayer)(Rating), state => {
    return {
        user: state.user
    };
});
