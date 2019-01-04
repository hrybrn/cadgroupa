import React, { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import {GridList, GridListTile,withStyles, ListSubheader, CircularProgress, Checkbox} from '@material-ui/core';
import CardTile from 'components/CardTile/CardTile';
import { gameQuery } from 'queries/games'; 

import csgo from 'assets/game-logos/csgo.png';
import dota2 from 'assets/game-logos/dota2.png';
import farcry5 from 'assets/game-logos/farcry5.png';
import fifa19 from 'assets/game-logos/fifa19.png';
import fortnite from 'assets/game-logos/fortnite.png';
import gtav from 'assets/game-logos/gtav.png';
import heartstone from 'assets/game-logos/heartstone.png';
import lol from 'assets/game-logos/lol.png';
import minecraft from 'assets/game-logos/minecraft.png';
import overwatch from 'assets/game-logos/overwatch.png';
import pubg from 'assets/game-logos/pubg.png';
import rocketleague from 'assets/game-logos/rocketleague.png';
import tf2 from 'assets/game-logos/tf2.png';
import tomclancy from 'assets/game-logos/tomclancy.png';

function getImage(name) {
    console.log(name);
    switch(name) {
    case 'csgo':
        return csgo;
    case 'dota2':
        return dota2;
    case 'farcry5':
        return farcry5;
    case 'fifa19':
        return fifa19;
    case 'fortnite':
        return fortnite;
    case 'gtav':
        return gtav;
    case 'heartstone':
        return heartstone;
    case 'lol':
        return lol;
    case 'minecraft':
        return minecraft;
    case 'overwatch':
        return overwatch;
    case 'pubg':
        return pubg;
    case 'rocketleague':
        return rocketleague;
    case 'tf2':
        return tf2;
    case 'tomclancy':
        return tomclancy;
    }
}

const styles = () => ({
    gridList: {
        width: 300,
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
        noOfPlayers: 2,
        modes: [],
        selectedGame: ''
    };

    handleChange(event) {
        this.setState({ noOfPlayers: parseInt(event.target.value) });
    }

    gameTiles(data, classes) {
        if (data.loading || data.games === undefined) {
            return (
                <GridListTile className={classes.titleTile} cols={2}>
                    <CircularProgress/>
                </GridListTile>
            );
        } else {
            return data.games.map(game =>
                <CardTile
                    key={game.id}
                    pressed={this.gameSelected.bind(this, game)}
                    active={this.state.selectedGame === game.name}
                    {...game}
                    icon={getImage(game.icon)}
                />
            );
        }
    }

    gameSelected(game) {
        this.setState(prev => prev.selectedGame === game.name ? { selectedGame: '' } : { selectedGame: game.name });
    }
    
    renderModes = () => {
        return this.state.modes.map(
            (mode) =>
                <GridListTile key={mode}>
                    <Checkbox>
                        {mode}
                    </Checkbox>
                </GridListTile>
        );
    }

    render() {
        const { gridList } = this.props.classes;
        return (
            <Fragment>
                <GridList className={gridList}>
                    <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
                        <ListSubheader component="div">Games</ListSubheader>
                    </GridListTile>
                    {this.gameTiles(this.props.data, this.props.classes)}
                </GridList>
                <GridList className={gridList}>
                    <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
                        <ListSubheader component="div">Modes</ListSubheader>
                    </GridListTile>
                    {this.renderModes}
                </GridList>
                
            </Fragment>
        );
    }
}

export default graphql(gameQuery)(withStyles(styles)(LeftPanel));
