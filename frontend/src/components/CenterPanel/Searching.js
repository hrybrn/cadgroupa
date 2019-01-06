import React, { Component, Fragment } from 'react';
import { LinearProgress , FormLabel, Grid} from '@material-ui/core';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';

import { mapStatesToProps } from 'react-fluxible';
import { updateStore } from 'fluxible-js';

class Searching extends Component {
    state = {
        defaultSleepTime: 5000
    }

    constructor(props) {
        super(props);
        this.poll();
    }

    async poll() {
        const sleepTime = !this.props.data.loading && this.props.data.matchmaking && this.props.data.matchmaking.register ? this.props.data.matchmaking.register * 1000 : this.state.defaultSleepTime;
        await new Promise(resolve => setTimeout(resolve, sleepTime));
        this.props.mutate().then(this.continuePolling.bind(this), this.continuePolling.bind(this));
    }

    async continuePolling({ error, data }) {
        if (error) {
            console.log(error);
        } else {
            if (data.matchmaking.poll.success) {
                updateStore({
                    search: {
                        ...this.props.search,
                        state: 'matched',
                        players: data.matchmaking.poll.players,
                        url: data.matchmaking.poll.url
                    }
                });
            } else {
                this.poll();
            }
        }
    }

    render() {
        return(
            <Fragment>
                <Grid
                    container
                    spacing={0}
                    alignItems="center"
                    justify="center"
                    style={{ minHeight: '100vh' }}
                >
                    <FormLabel>Finding other players for {this.props.selectedGame.name} <br/> <br/> <br/> <br/> <LinearProgress /></FormLabel>
                </Grid>
            </Fragment>
        );
    }        
}

const registerSearch = graphql(gql`query RegisterSearch(
    $game: String
    $lon: Float
    $rank: Int
    $players: Int
    $token: String
    $mode: String
    $lat: Float) {
    matchmaking {
        register(game: $game,
            lon: $lon,
            rank: $rank,
            players: $players,
            token: $token
            mode: $mode
            lat: $lat)
    }
}`, {
    options: (props) => ({
        variables: {
            game: props.search.selectedGame.name,
            lon: props.search.searchOptions.lon,
            lat: props.search.searchOptions.lat,
            rank: props.search.searchOptions.rank,
            players: props.search.selectedMode.players,
            token: props.user.token,
            mode: props.search.selectedMode.name
        }
    })
});

const pollQuery = graphql(gql`mutation PollQuery($token: String) {
    matchmaking {
        poll(token: $token) {
            url
            success
            players {
                userId
                displayName
            }
        }
    }
}`, {
    options: (props) => ({
        variables: {
            token: props.user.token
        }
    })
});

export default mapStatesToProps(compose(pollQuery, registerSearch)(Searching), state => {
    return {
        user: state.user,
        search: state.search
    };
});
