import React, { Component, Fragment } from 'react';

import { mapStatesToProps } from 'react-fluxible';
import { Button , FormLabel, Grid} from '@material-ui/core';

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
            if (this.props.loggedin) {
                return <MessageBox message={'Select a game and mode on the left.'} />;
            } else {
                return <MessageBox message={<Button href='/login'>Login to use matchma.kr.</Button>} />;
            }
        case 'logout':
            return <MessageBox message={<Button href='/login'>Login to use matchma.kr.</Button>} />;
        case 'data':
            return <DataForm success={this.startSearch.bind(this)} onClose={this.stopSearch.bind(this)}/>;
        case 'searching':
            return <Searching selectedGame={this.props.search.selectedGame} selectedMode={this.props.search.selectedMode} />;
        case 'matched':
            return <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh' }}
            >
                <Button href={this.props.search.url} target='_blank' color='primary' variant='contained'>Join your team on discord</Button>
                <div>
                    <Grid container>
                        <FormLabel><br/><br/><br/>Rate your player matches<br/><br/></FormLabel>
                    </Grid>
                    {this.props.search.players.map(player => player.userId === this.props.user.id ? <Fragment/> : <Fragment><br/><br/><Rating key={player.userId} player={player} /></Fragment>  )}
                </div>
            </Grid>;
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

    stopSearch() {
        updateStore({
            search: {
                ...this.props.search,
                state: this.props.user.loggedin ? 'loggedin' : 'logout'
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
