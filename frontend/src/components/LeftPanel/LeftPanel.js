import React, { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import {GridList, GridListTile,withStyles, ListSubheader, CircularProgress, Checkbox} from '@material-ui/core';
import CardTile from 'components/CardTile/CardTile';
import { gameQuery } from 'queries/games'; 

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
    constructor(props){
        super(props);
        this.state = {
            noOfPlayers: 2,
            modes: [],
            selectedGame: ''
        };
    }
    handleChange = event => {

        this.setState({ noOfPlayers: parseInt(event.target.value) });

    };
    gameTiles(data, classes) {
        if (data.loading || data.friends === undefined) {
            return (
                <GridListTile className={classes.titleTile} cols={2}>
                    <CircularProgress/>
                </GridListTile>
            );
        } else {
            return this.props.data.games.map(game =>
                <CardTile
                    key={game.id}
                    activated={this.activated(game)}
                    deactivated={this.deactivated}
                    active={this.state.selectedGame == game.name ? true : false}
                    {...game}
                />
            );
        }
    }

    activated = (game) => {
        this.setState({modes: game.modes, selectedGame: game.name});
    }

    deactivated() {

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
