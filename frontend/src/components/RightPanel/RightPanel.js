import React, { Component, Fragment } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { GridList, GridListTile, ListSubheader, withStyles, CircularProgress} from '@material-ui/core';
import CardTile from 'components/CardTile/CardTile';
import { mapStatesToProps } from 'react-fluxible'; 
import DiscordIcon from 'assets/discordicon.png';
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
                        <ListSubheader component='div'>Recent Players</ListSubheader>
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
        } else if (data.recentPlayers == null) {
            return (
                <GridListTile className={classes.titleTile} cols={2}>
                    <ListSubheader component='div'>No Recent Players</ListSubheader>
                </GridListTile>
            );
        } else {
            return data.recentPlayers.map(recent =>
                <CardTile
                    key={recent.id}
                    active={false}
                    pressed={this.activated.bind(this, recent.id)}
                    icon={DiscordIcon}
                    {...recent}
                />
            );
        }
    }

    activated(id) {
        window.open('https://discordapp.com/users/'.concat(id));
    }

   
}

export const recentQuery = graphql(gql`query RecentPlayers($token: String) {
    recentPlayers(token: $token) {
        id
        name
    }
}`, {
    options: (props) => ({
        variables: {
            token: props.user.token
        }
    })
});

export default mapStatesToProps(recentQuery(withStyles(styles)(RightPanel)), state => {
    return {
        user: state.user
    };
});
