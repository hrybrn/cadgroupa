import React, { Component } from 'react';

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
            this.state.matchmakingState = 'matched';
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.search.state) {
            this.setState({ matchmakingState: nextProps.search.state });
        }
    }

    render() {
        const players = 
            [
                {userId: 'harry',
                    displayName: 'harry'},
                {userId: 'Chris',
                    displayName: 'chris'}
            ];
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
            return <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh' }}
            >
                <Button href={'this.state.search.url'} >Join your team on discord</Button>
                <div>
                    <Grid container>
                        <FormLabel><br/><br/><br/>Rate your player matches <br/><br/></FormLabel>
                    </Grid>
                    {players.map(player => <Rating key={player.userId} player={player} />)}
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
}

export default mapStatesToProps(CenterPanel, state => {
    return {
        user: state.user,
        search: state.search
    };
});
