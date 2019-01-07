import React, { Component, Fragment } from 'react';
import { FormLabel, Grid } from '@material-ui/core';

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import ThumbsUp from '@material-ui/icons/ThumbUp';
import ThumbsDown from '@material-ui/icons/ThumbDown';

import { mapStatesToProps } from 'react-fluxible';

class Rating extends Component {
    render() {
        const { player } = this.props;

        return (
            <Grid container>
                <br/>
                <FormLabel>{player.displayName}&nbsp;&nbsp;&nbsp;&nbsp;</FormLabel>
                <Vote player={player} rated={false} sendFeedback={this.sendFeedback.bind(this, player.userId)}/>
            </Grid>
        );
    }

    sendFeedback(recipientID, good) {
        this.props.mutate({ variables: { recipientID, good, token: this.props.user.token }});
    }
}
class Vote extends Component{
    state = {
        rated:this.props.rated
    };
    render() {
        return (
            this.state.rated ?
                <FormLabel>Thanks for rating this player</FormLabel>
                :<Fragment>
                    <ThumbsUp type="button" onClick={() => this.props.sendFeedback(true)}></ThumbsUp>
                    &nbsp;
                    <ThumbsDown type="button" onClick={() => this.props.sendFeedback(false)}></ThumbsDown>
                </Fragment>
                
        );
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
