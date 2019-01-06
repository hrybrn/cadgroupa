import React, { Component, Fragment } from 'react';
import { LinearProgress , FormLabel, Grid} from '@material-ui/core';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';

import { mapStatesToProps } from 'react-fluxible';

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

    async continuePolling() {
        this.poll();
    }

    render() {
        const { loading, matchmaking } = this.props.data;
        if (loading || !matchmaking || !matchmaking.register){
            return(
                <Fragment>
                    <Grid
                        container
                        spacing={0}
                        alignItems="center"
                        justify="center"
                        style={{ minHeight: '100vh' }}
                    >
                        <FormLabel>Finding other players for {this.props.selectedGame.name}<LinearProgress /></FormLabel>
                    </Grid>
                </Fragment>
            );
        } else {
            return(
                <button>make me better button</button>
            );
        }
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

const pollQuery = graphql(gql`mutation PollQuery($token: String!) {
    data {
        matchmaking {
            poll {
                success
                playerDiscordIDs
                groupDMURL
            }
        }
    }
}`, {
    options: (props) => ({
        variables: {
            token: props.user
        }
    })
});

export default mapStatesToProps(compose(pollQuery, registerSearch)(Searching), state => {
    return {
        user: state.user,
        search: state.search
    };
});
