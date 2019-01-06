import React, { Component } from 'react';

import { mapStatesToProps } from 'react-fluxible';
import { Button } from '@material-ui/core';

import Searching from './Searching';
import Rating from './Rating';
import DataForm from './DataForm';

import MessageBox from 'components/MessageBox/MessageBox';

import { updateStore } from 'fluxible-js';

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
        if (nextProps.search.state) {
            this.setState({ matchmakingState: nextProps.search.state });
        }
    }

    render() {
        switch(this.state.matchmakingState) {
        case 'loggedin':
            return <MessageBox message={'Select a game and mode on the left.'} />;
        case 'logout':
            return <MessageBox message={<Button href='/login'>Login to use matchma.kr.</Button>} />;
        case 'data':
            return <DataForm success={this.startSearch.bind(this)} />;
        case 'searching':
            return <Searching selectedGame={this.props.search.selectedGame} selectedMode={this.props.search.selectedMode} />;
        case 'matched':
            return <Rating />;
        }
    }

    startSearch(searchOptions) {
        updateStore({
            search: {
                ...this.props.search,
                searchOptions,
                state: 'searching'
            }
        });
    }
}

export default mapStatesToProps(CenterPanel, state => {
    return {
        user: state.user,
        search: state.search
    };
});
