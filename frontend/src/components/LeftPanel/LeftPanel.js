import React, { Component, Fragment } from 'react';
import {GridList, GridListTile,withStyles, ListSubheader, CircularProgress, Radio, RadioGroup, FormControlLabel, Button } from '@material-ui/core';
import CardTile from 'components/CardTile/CardTile';
import { gameQuery } from 'queries/games'; 
import { getGameLogo } from 'assets/game-logos';

import { updateStore } from 'fluxible-js';
import { mapStatesToProps } from 'react-fluxible';

import { graphql } from 'react-apollo';

const styles = () => ({
    gridList: {
        width: 318,
        maxHeight: '50%',
        margin: '0 !important'
    },
    titleTile: {
        height: '50px !important',
        'text-align': 'center',
        margin: '0 auto',
    },
    radio: {
        left: 0
    }
});


class LeftPanel extends Component {
    state = {
        selectedGame: null,
        selectedMode: null,
    };

    gameTiles(data, classes) {
        if (data.loading || data.games === undefined) {
            return (
                <GridListTile className={classes.titleTile} cols={2}>
                    <CircularProgress />
                </GridListTile>
            );
        } else {
            return data.games.map(game =>
                <CardTile
                    key={game.id}
                    pressed={this.gameSelected.bind(this, game)}
                    active={this.state.selectedGame && this.state.selectedGame.name === game.name}
                    {...game}
                    icon={getGameLogo(game.icon)}
                />
            );
        }
    }

    gameSelected(game) {
        this.setState(prev => prev.selectedGame && prev.selectedGame.id === game.id ? {
            selectedMode: null,
            selectedGame: null
        } : {
            selectedMode: null,
            selectedGame: game
        });
    }

    modeSelected({ target: { value: modeName }}) {
        const selectedMode = this.state.selectedGame.modes.filter(mode => mode.name === modeName)[0];
        this.setState({ selectedMode });
    }
    
    renderModes() {
        if (!this.state.selectedGame) {
            return [];
        }

        return this.state.selectedGame.modes.map(
            (mode) =>
                <FormControlLabel
                    key={mode.name}
                    value={mode.name}
                    control={<Radio color="primary" />}
                    label={mode.name}
                    labelPlacement="start"
                    
                />
        );
    }

    search() {
        const { selectedGame, selectedMode } = this.state;

        updateStore({
            search: {
                state: 'data',
                selectedGame,
                selectedMode
            }
        });
    }

    render() {
        const { gridList } = this.props.classes;
        return (
            <Fragment>
                <GridList className={gridList}>
                    <GridListTile key="Subheader" cols={2} style={{ height: 'auto', 'text-align': 'center' }}>
                        <ListSubheader component="div">Games</ListSubheader>
                    </GridListTile>
                </GridList>
                <GridList className={gridList}>
                    {this.gameTiles(this.props.data, this.props.classes)}
                </GridList>      
                <GridList className={gridList}>
                    <GridListTile key="Subheader" cols={2} style={{ height: 'auto', 'text-align': 'center' }}>
                        <hr/>
                        <ListSubheader component="div">Modes</ListSubheader>
                    </GridListTile>
                </GridList>
                <GridList className={gridList}>
                    <RadioGroup value={this.state.selectedMode && this.state.selectedMode.name} onChange={this.modeSelected.bind(this)}>
                        {this.renderModes()}
                    </RadioGroup>
                </GridList>
                {this.props.user.loggedin ?
                    <GridList className={gridList}>
                        <GridListTile key="Subheader" cols={2} style={{ height: 'auto', 'text-align': 'center' }}>
                            {this.state.selectedGame && this.state.selectedMode && <Button onClick={this.search.bind(this)}>Search</Button>}
                        </GridListTile>
                    </GridList>:
                    <Fragment></Fragment>
                }
            </Fragment>
        );
    }
}

export default mapStatesToProps(graphql(gameQuery)(withStyles(styles)(LeftPanel)), state => ({
    user: state.user
}));
