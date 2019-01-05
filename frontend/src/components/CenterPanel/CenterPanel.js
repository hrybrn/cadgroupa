import React, { Component } from 'react';

import { mapStatesToProps } from 'react-fluxible';
import { withStyles, Typography, Paper, Button } from '@material-ui/core';

import Searching from './Searching';
import Rating from './Rating';

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
    },
});

class CenterPanel extends Component {
    state = {
        matchmakingState: 'searching'
    };

    constructor(props) {
        super(props);

        if (this.props.user.loggedin) {
            this.state.matchmakingState = 'loggedin';
        }
    }

    render() {
        switch(this.state.matchmakingState) {
        case 'loggedin':
            return this.generateMessageBox('Select a game and mode on the left.');
        case 'logout':
            return this.generateMessageBox(<Button href='/login'>Login to use matchma.kr.</Button>);
        case 'searching':
            return <Searching />;
        case 'matched':
            return <Rating/>;
        }
    }

    generateMessageBox(message) {
        return (
            <div  className={this.props.classes.content}>
                <div id='heightOffset' style={{ height: '100px' }}/>
                <Paper className={this.props.classes.root}>
                    <Typography variant='h4'>{message}</Typography>
                </Paper>
            </div>
        );
    }
}

export default mapStatesToProps(withStyles(styles)(CenterPanel), state => {
    return {
        user: state.user
    };
});
