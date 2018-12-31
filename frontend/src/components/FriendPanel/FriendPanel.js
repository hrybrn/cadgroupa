import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { GridList, GridListTile, ListSubheader, withStyles, CircularProgress } from '@material-ui/core';
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

class FriendPanel extends Component {
    render() {
        const { gridList, titleTile } = this.props.classes;

        return (
            <GridList className={gridList}>
                <GridListTile className={titleTile} cols={2}>
                    <ListSubheader component='div'>Friends</ListSubheader>
                </GridListTile>
                {this.friendTiles(this.props.data, this.props.classes)}
            </GridList>
        );
    }

    friendTiles(data, classes) {
        if (data.loading || data.friends === undefined) {
            return (
                <GridListTile className={classes.titleTile} cols={2}>
                    <CircularProgress/>
                </GridListTile>
            );
        } else {
            return data.friends.map(friend =>
                <CardTile
                    key={friend.id}
                    activated={this.activated}
                    deactivated={this.deactivated}
                    {...friend}
                />
            );
        }
    }

    activated() {

    }

    deactivated() {

    }
}

export const friendQuery = gql`{
    data {
        friends {
            id
            name
            icon
        }
    }
}`;

export default graphql(friendQuery)(withStyles(styles)(FriendPanel));
