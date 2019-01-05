import React, { Component, Fragment } from 'react';
import { LinearProgress , FormLabel, Grid} from '@material-ui/core';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class Searching extends Component {
    state = {
        currentlyPolling: false
    };

    constructor(props) {
        super(props);
        this.poll();
    }

    async poll() {
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.props.data.refetch().then(this.continuePolling.bind(this), this.continuePolling.bind(this));
    }

    async continuePolling() {
        if (this.props.data.loading || !this.props.data.matchmaking || !this.props.data.matchmaking.registerSearch.success) {
            this.poll();
        }
    }

    render() {
        const { loading, matchmaking } = this.props.data;

        if (loading || !matchmaking || !matchmaking.registerSearch.success){
            return(
                <Fragment>
                    <Grid
                        container
                        spacing={0}
                        alignItems="center"
                        justify="center"
                        style={{ minHeight: '100vh' }}
                    >
                        <FormLabel>Finding other players <LinearProgress /></FormLabel>
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

export const searchQuery = gql`{
    data {
        matchmaking {
            registerSearch{
                success
            }
        }
    }
}`;

export default graphql(searchQuery)(Searching);
