import React, { Component, Fragment } from 'react';
import {GridList, GridListTile, FormLabel, Card, ListSubheader, Checkbox, RadioGroup, Radio, FormControlLabel} from '@material-ui/core';

class LeftPanel extends Component {
    constructor(props){
        super(props);
        this.state = {
            noOfPlayers: 1
        };
    }
    handleChange = event => {

        this.setState({ noOfPlayers: parseInt(event.target.value) });

    };

    renderGames = games => {
        return games.map(
            (game) =>
                <GridListTile key={game.name}>
                    <Card inputtype='checkbox'>
                        {game.name}
                    </Card>
                </GridListTile>
        );
    }
    
    renderModes = modes => {
        return modes.map(
            (mode) =>
                <GridListTile key={mode.name}>
                    <Checkbox>
                        {mode.name}
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
                { [1,2,3,4,5].map(
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
        return (
            <Fragment>
                <GridList>
                    <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
                        <ListSubheader component="div">Games</ListSubheader>
                    </GridListTile>
                    {this.renderGames}
                </GridList>
                <GridList>
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

export default LeftPanel;
