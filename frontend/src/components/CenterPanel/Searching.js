import React, { Component, Fragment } from 'react';
import { LinearProgress , FormLabel, Grid} from '@material-ui/core';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';




class Searching extends Component {
    renderloading(data) {
        if (data.loading || data.matchmaking.registerSearch.success == false){
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
    
    

    render() {
        return (
            setInterval(this.renderloading.bind(this, this.props.data.refetch), 1000)
        );

    }
        
}

export const searchQuery = gql`{
    data {
        matchmaking {
            reigsterSearch{
                success
            }
        }
    }
}`;

export default graphql(searchQuery)(Searching);