import React, { Component, Fragment } from 'react';
import {  FormLabel, Grid} from '@material-ui/core';

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import ThumbsUp from '@material-ui/icons/ThumbUp';
import ThumbsDown from '@material-ui/icons/ThumbDown';

class Rating extends Component {
    render() {
        return <Grid
            container
            spacing={0}
            alignItems="center"
            justify="center"
            style={{ minHeight: '100vh' }}
        >
            {this.props.players.map(player =>
                <Fragment key={player.name}>
                    <FormLabel>{player.name}</FormLabel>
                    <ThumbsUp type="button" onClick={this.sendFeedback.bind(this, player.id, true)}></ThumbsUp>
                    <ThumbsDown type="button" onClick={this.sendFeedback.bind(this, player.id, false)}></ThumbsDown>
                </Fragment>
            )   }
        </Grid>;
    }

    sendFeedback(playerID, good) {
        this.props.mutate({ variables: { playerID, good }});
    }
}

const RatePlayer = gql`mutation RatePlayer($playerID: String, $good: Boolean, $token: String){
    matchmaking {
        rating(playerID: $playerID, good: $good, token: $token) {
            success
        }
    }
}`;

export default graphql(RatePlayer)(Rating);
