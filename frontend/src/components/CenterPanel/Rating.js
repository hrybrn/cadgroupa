import React, { Component, Fragment } from 'react';
import {  FormLabel, Grid} from '@material-ui/core';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import ThumbsUp from '@material-ui/icons/ThumbUp';
import ThumbsDown from '@material-ui/icons/ThumbDown';

class Searching extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Grid
                container
                spacing={0}
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh' }}
            >
                {this.data.poll.players.map(player =>
                    <Fragment key={player}>
                        <FormLabel>player.name</FormLabel>
                        <ThumbsUp type="button" onClick={this.sendFeedback.bind(this, player.id, true)}></ThumbsUp>
                        <ThumbsDown type="button" onClick={this.sendFeedback.bind(this, player.id, false)}></ThumbsDown>
                    </Fragment>
                )   }
            </Grid>
        );
    }

    sendFeedback(playerID, good) {
        this.props.mutate({ variables: { playerID, good }});
    }
}

export const rateMutation = gql`mutation RatePlayer($playerID: String!, $good: Boolean){
        rating(playerID: $playerID, good: $good) {
            success
        }
    }
}`;

export const playersQuery = gql`{
    data {
        poll {
            players{
            }
        }
    }
}`;

export default graphql(playersQuery, rateMutation)(Searching);
