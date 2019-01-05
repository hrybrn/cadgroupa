import React, { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import {GridList, GridListTile,withStyles, ListSubheader, CircularProgress, Radio, RadioGroup, FormControlLabel, Button } from '@material-ui/core';
import CardTile from 'components/CardTile/CardTile';
import { gameQuery } from 'queries/games'; 
import { getGameLogo } from 'assets/game-logos';

const styles = () => ({
    gridList: {
        width: 315,
        maxHeight: 500
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
        selectedGame: '',
        selectedMode: '',
    };

    handleChange(event) {
        this.setState({ noOfPlayers: parseInt(event.target.value) });
    }

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
                    active={this.state.selectedGame === game.name}
                    {...game}
                    icon={getGameLogo(game.icon)}
                />
            );
        }
    }

    gameSelected(game) {
        this.setState(prev => prev.selectedGame === game.name ? { selectedMode: '', selectedGame: '', modes: [] } : { selectedMode: '', selectedGame: game.name, modes: game.modes });
    }

    modeSelected({ target: { value: value }}) {
        this.setState({ selectedMode: value });
    }
    
    renderModes() {
        return this.state.modes.map(
            (mode) =>
                <FormControlLabel
                    value={mode.name}
                    control={<Radio color="primary" />}
                    label={mode.name}
                    labelPlacement="start"
                    key={mode.name}
                />
        );
    }

    search() {
        // TODO: implement search start
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
                        <ListSubheader component="div">Modes</ListSubheader>
                    </GridListTile>
                </GridList>
                <GridList className={gridList}>
                    <RadioGroup value={this.state.selectedMode} onChange={this.modeSelected.bind(this)}>
                        {this.renderModes()}
                    </RadioGroup>
                </GridList>
                <GridList className={gridList}>
                    <GridListTile key="Subheader" cols={2} style={{ height: 'auto', 'text-align': 'center' }}>
                        {this.state.selectedGame && this.state.selectedMode && <Button onClick={this.search.bind(this)}>Search</Button>}
                    </GridListTile>
                </GridList>
            </Fragment>
        );
    }
}

export default graphql(gameQuery)(withStyles(styles)(LeftPanel));
