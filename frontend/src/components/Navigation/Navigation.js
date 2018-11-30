import React, { Component, Fragment } from 'react';

import { Drawer, AppBar, IconButton, Menu, MenuItem, Toolbar, withStyles } from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import Person from '@material-ui/icons/Person';

import LeftPanel from '../LeftPanel/LeftPanel';

import logo from './matchmakr.png';

const styles = theme => ({
    logo: {
        height: theme.mixins.toolbar.minHeight,
        margin: '0 auto',
    },
    navigation: {
        zIndex: theme.zIndex.drawer + 1
    },
    toolbar: theme.mixins.toolbar,
});

class Navigation extends Component {
    state = {
        anchorEl: null,
        drawerOpen: false,
    };

    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    toggleDrawer = () => {
        this.setState(prev => ({ drawerOpen: !prev.drawerOpen }));
    };

    render() {
        const { anchorEl, drawerOpen } = this.state;
        const accountMenuOpen = Boolean(anchorEl);

        return (
            <Fragment>
                <AppBar className={this.props.classes.navigation}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="Menu"
                            onClick={this.toggleDrawer}
                        >
                            <MenuIcon />
                        </IconButton>
                        <img
                            src={logo}
                            className={this.props.classes.logo}
                            alt='matchma.kr logo'
                        />
                        <div className='accountMenu' >
                            <IconButton
                                aria-owns={ accountMenuOpen ? 'menu-appbar' : undefined }
                                aria-haspopup="true"
                                onClick={this.handleMenu}
                                color="inherit"
                            >
                                <Person />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                open={accountMenuOpen}
                                onClose={this.handleClose}
                            >
                                <MenuItem onClick={this.handleClose}>Account</MenuItem>
                                <MenuItem onClick={this.handleClose}>Logout</MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
                <Drawer
                    anchor='left'
                    open={drawerOpen}
                    variant='persistent'
                    className={this.props.classes.drawer}
                >
                    <div className={this.props.classes.toolbar} />
                    <LeftPanel />
                </Drawer>
            </Fragment>
        );
    }
}

export default withStyles(styles)(Navigation);
