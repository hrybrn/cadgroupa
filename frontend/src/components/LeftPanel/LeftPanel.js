import React, { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import {GridList, GridListTile, FormLabel,withStyles, ListSubheader, CircularProgress, Checkbox, RadioGroup, Radio, FormControlLabel} from '@material-ui/core';
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
    }
});


class LeftPanel extends Component {
    constructor(props){
        super(props);
        this.state = {
            noOfPlayers: 2,
            modes: []
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
            return data.game.map(game =>
                <CardTile
                    key={game.id}
                    activated={this.activated(game.modes)}
                    deactivated={this.deactivated}
                    {...game}
                />
            );
        }
    }

    activated(newModes) {
        this.setState({modes: newModes});
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
    renderNumberOfPlayers = () => {
        return( 
            <RadioGroup
                value={this.state.noOfPlayers}
                onChange={this.handleChange}
            >
                { [2,3,4,5,6].map(
                    (number) =>
                        <FormControlLabel
                            
                            value={number}
                            control={<Radio color="primary" />}
                            label={number}
                            labelPlacement="start"
                            key={number}
                        />
                )
                }
            </RadioGroup>
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
                <FormLabel>Number of Players</FormLabel>
                {
                    this.renderNumberOfPlayers()
                }
            </Fragment>
        );
    }
}

export default graphql(gameQuery)(withStyles(styles)(LeftPanel));
