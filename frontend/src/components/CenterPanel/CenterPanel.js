import React, { Component } from 'react';

import { mapStatesToProps } from 'react-fluxible';
import { Button } from '@material-ui/core';

import Searching from './Searching';
import Rating from './Rating';

import MessageBox from 'components/MessageBox/MessageBox';

class CenterPanel extends Component {
    state = {
        matchmakingState: 'logout'
    };

    constructor(props) {
        super(props);

        if (this.props.user.loggedin) {
            this.state.matchmakingState = 'loggedin';
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.search.inProgress) {
            this.setState({ matchmakingState: 'searching' });
        }
    }

    render() {
        switch(this.state.matchmakingState) {
        case 'loggedin':
            return <MessageBox message={'Select a game and mode on the left.'} />;
        case 'logout':
            return <MessageBox message={<Button href='/login'>Login to use matchma.kr.</Button>} />;
        case 'searching':
            return <Searching selectedGame={this.props.search.selectedGame} selectedMode={this.props.search.selectedMode} />;
        case 'matched':
            return <Rating />;
        }
    }
}

export default mapStatesToProps(CenterPanel, state => {
    return {
        user: state.user,
        search: state.search
    };
});
