import React, { Component, Fragment } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { GridList, GridListTile, ListSubheader, withStyles, CircularProgress} from '@material-ui/core';
import CardTile from 'components/CardTile/CardTile';

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

class RightPanel extends Component {
    render() {
        const { gridList, titleTile } = this.props.classes;

        return (
            <Fragment>
                <GridList className={gridList}>
                    <GridListTile className={titleTile} cols={2}>
                        <ListSubheader component='div'>Recent Players (Click for link to discord)</ListSubheader>
                    </GridListTile>
                    {this.playerTiles(this.props.data, this.props.classes)}
                </GridList>
            </Fragment>
        );
    }

    playerTiles(data, classes) {
        if (data.loading || data.recentPlayers === undefined) {
            return (
                <GridListTile className={classes.titleTile} cols={2}>
                    <CircularProgress/>
                </GridListTile>
            );
        } else {
            return data.recentPlayers.map(recent =>
                <CardTile
                    key={recent.id}
                    active={false}
                    pressed={this.activated.bind(this, recent.id)}
                    icon=''
                    {...recent}
                />
            );
        }
    }

    activated(id) {
        window.location='https://discordapp.com/users/'.concat(id);
    }

   
}

export const recentQuery = gql`{
    data {
        recentPlayers($token: "token") {
            id
            name
        }
    }
}`;

export default graphql(recentQuery)(withStyles(styles)(RightPanel));
