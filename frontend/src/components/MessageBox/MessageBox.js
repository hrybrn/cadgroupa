import React, { Component } from 'react';
import { Paper, Typography, withStyles } from '@material-ui/core';

const styles = theme => ({
    content: {
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center',
        'flex-direction': 'column',
    },
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        'maxWidth': 'calc(100vw - 700px)'
    },
});

class MessageBox extends Component {
    render() {
        return (
            <div  className={this.props.classes.content}>
                <div id='heightOffset' style={{ height: '100px' }}/>
                <Paper className={this.props.classes.root}>
                    <Typography variant='h4'>{this.props.message}</Typography>
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(MessageBox);
