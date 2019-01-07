import React, { Component, Fragment } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Button, GridList, GridListTile, ListSubheader, withStyles, CircularProgress} from '@material-ui/core';
import CardTile from 'components/CardTile/CardTile';
import { mapStatesToProps } from 'react-fluxible'; 
import DiscordIcon from 'assets/discordicon.png';
import { updateStore } from 'fluxible-js';

const styles = () => ({
    gridList: {
        width: 318,
        margin: '0 !important'
    },
    titleTile: {
        height: '50px !important',
        'text-align': 'center',
    }
});

class RightPanel extends Component {
    render() {
        const { gridList, titleTile } = this.props.classes;

        const nextTheme = this.props.theme === 'light' ? 'dark' : 'light';

        return (
            <Fragment>
                <GridList className={gridList}>
                    <GridListTile className={titleTile} cols={2}>
                        <ListSubheader component='div'>Recent Players</ListSubheader>
                    </GridListTile>
                    {this.playerTiles(this.props.data, this.props.classes)}
                </GridList>
                <Button style={{ marginTop: 'auto', marginBottom: 15 }} onClick={this.switchTheme.bind(this, nextTheme)}>Change to {nextTheme} theme</Button>
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
        } else if (data.recentPlayers == []) {
            return (
                <GridListTile className={classes.titleTile} cols={2}>
                    <ListSubheader component='div'>No Recent Players</ListSubheader>
                </GridListTile>
            );
        } else {
            return data.recentPlayers.map(recent =>
                <CardTile
                    key={recent.userId}
                    active={false}
                    pressed={this.activated.bind(this, recent.userId)}
                    icon={recent.avatar ? `https://cdn.discordapp.com/avatars/${recent.userId}/${recent.avatar}.png?size=256` : DiscordIcon}
                    name={recent.displayName}
                />
            );
        }
    }

    activated(id) {
        window.open('https://discordapp.com/users/'.concat(id));
    }

    switchTheme(theme) {
        updateStore({
            theme
        });
    }
}

export const recentQuery = graphql(gql`query RecentPlayers($token: String) {
    recentPlayers(token: $token) {
        displayName
        userId
        avatar
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
        user: state.user,
        theme: state.theme
    };
});
