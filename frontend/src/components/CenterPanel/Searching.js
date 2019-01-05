import React, { Component, Fragment } from 'react';
import { LinearProgress, withStyles , FormLabel, Grid} from '@material-ui/core';

class Searching extends Component {
    render() {
        if (data.loading){
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

            );
        }
    }
}

export default Searching;