import React, { Component, Fragment } from 'react';
import { Drawer, AppBar, IconButton, Menu, MenuItem, Toolbar, withStyles, Button, DialogContentText, CircularProgress, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/MenuSharp';
import Person from '@material-ui/icons/Person';

import { mapStatesToProps } from 'react-fluxible';
import { updateStore } from 'fluxible-js';

import { graphql } from 'react-apollo';
import { get_user_obj } from 'queries/discord';

import LeftPanel from 'components/LeftPanel/LeftPanel';
import Modal from 'components/Modal/Modal';
import FriendPanel from 'components/FriendPanel/FriendPanel';

import matchmakr from 'assets/matchmakr.png';

import { Route } from 'react-router-dom';

import Login from 'components/Auth/Login';
import Auth from 'components/Auth/Auth';
import CenterPanel from 'components/CenterPanel/CenterPanel';
import MessageBox from 'components/MessageBox/MessageBox';

const styles = theme => ({
    logo: {
        height: theme.mixins.toolbar.minHeight,
        position: 'absolute',
        margin: 'auto',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

    navigation: {
        zIndex: theme.zIndex.drawer + 1,
        'text-align': 'center',
    },
    
    spreadToolbar: {
        display: 'flex',
        'justify-content': 'space-between'
    },

    toolbar: theme.mixins.toolbar,
});

class Navigation extends Component {
    state = {
        //menu anchor element
        anchorEl: null,
        //drawers shown
        drawers: {
            left: false,
            right: true,
        },
        //open modal
        modal: '',
        user: {
            token: '',
            loggedin: 0
        }
    };

    render() {
        const { logo, navigation, toolbar, spreadToolbar } = this.props.classes;
        const { anchorEl, drawers } = this.state;
        const accountMenuOpen = Boolean(anchorEl);

        const modal = this.renderModal();
        return (
            <Fragment>
                {this.props.data.error ? (<MessageBox message={this.props.data.error.message}/>) : (<Fragment></Fragment>)}
                <AppBar className={navigation}>
                    <Toolbar classes={{ root: spreadToolbar }}>
                        <IconButton
                            color='inherit'
                            aria-label='Menu'
                            onClick={this.toggleDrawer.bind(this)}
                            className='drawerButton'
                        >
                            <MenuIcon />
                        </IconButton>
                        <img
                            href='/'
                            src={matchmakr}
                            className={logo}
                            alt='matchma.kr logo'
                        />
                        {this.props.user.loggedin ? 
                            (
                                <div className='accountMenu' >
                                    <IconButton
                                        aria-owns={ accountMenuOpen ? 'menu-appbar' : undefined }
                                        aria-haspopup='true'
                                        onClick={this.handleMenu.bind(this)}
                                        color='inherit'
                                        className='accountButton'
                                    >
                                        <Person/>
                                        {this.usernameData(this.props.data)}
                                    </IconButton>
                                    <Menu
                                        id='menu-appbar'
                                        anchorEl={anchorEl}
                                        open={accountMenuOpen}
                                        onClose={this.handleClose.bind(this)}
                                    >
                                        <MenuItem onClick={this.showModal.bind(this, 'account')}>Account</MenuItem>
                                        <MenuItem onClick={this.showModal.bind(this, 'logout')}>Logout</MenuItem>
                                    </Menu>
                                </div>
                            ) : 
                            (
                                <Button href='/login' style={{ color: 'white' }}>Login</Button>
                            )}
                    </Toolbar>
                </AppBar>
                <Drawer
                    anchor='left'
                    open={drawers.left}
                    variant='persistent'
                >
                    <div className={toolbar} />
                    <LeftPanel />
                </Drawer>
                <Drawer
                    anchor='right'
                    open={drawers.right}
                    variant='permanent'
                >
                    <div className={toolbar} />
                    <FriendPanel />
                </Drawer>
                {modal}
                <div>
                    <div className={toolbar} />
                    <Route path='/auth' component={Auth}/>
                    <Route path='/login' component={Login}/>
                    <Route path='/error' component={<MessageBox message="Something went terribly wrong 😢" />}/>
                    <Route exact path='/' component={CenterPanel}/>
                </div>
            </Fragment>
        );
    }

    handleMenu(event) {
        this.setState({ anchorEl: event.currentTarget });
    }

    handleClose(){
        this.setState({ anchorEl: null });
    }

    toggleDrawer(){
        this.setState(prev => ({ drawers: { ...prev.drawers, left: !prev.drawers.left} }));
    }

    showModal(modal) {
        this.setState({ modal });
        this.handleClose();
    }

    renderModal() {
        const hideModal = this.showModal.bind(this, '');

        return (
            <Fragment>
                <Modal
                    open={this.state.modal === 'account'}
                    handleClose={hideModal}
                    title='Account'
                    fields={[
                        this.emailData(this.props.data),
                    ]}
                    buttons={[
                        <Button onClick={hideModal} color='primary' key='cancel'>
                            Cancel
                        </Button>,
                        <Button onClick={this.saveChanges.bind(this)} color='primary' key='subscribe' >
                            Save Changes
                        </Button>
                    ]}
                />
                <Modal
                    open={this.state.modal === 'logout'}
                    handleClose={hideModal}
                    title='Logout'
                    fields={[
                        <DialogContentText key='logoutMessage'>Are you sure you want to logout?</DialogContentText>
                    ]}
                    buttons={[
                        <Button onClick={hideModal} color='primary' key='cancel'>
                            Cancel
                        </Button>,
                        <Button onClick={this.logout.bind(this)} color='primary' key='subscribe'>
                            Logout
                        </Button>
                    ]}
                />
            </Fragment>
        );
    }

    usernameData(data) {
        if (data.loading || data.discord === undefined) {
            return <Typography style={{ color: 'white' }}>Loading...</Typography>;
        } else {
            return <Typography style={{ color: 'white' }}>{JSON.parse(data.discord.getuser).username}</Typography>;
        }
    }

    emailData(data) {
        if(!this.props.user.loggedin){
            return (<Typography value='h2'>Not logged in!</Typography>);
        }

        if (data.loading || data.discord === undefined) {
            return (<CircularProgress />);
        } else {
            const email = this.props.user.loggedin && this.props.data ? JSON.parse(this.props.data.discord.getuser).email : 'Not found';
            return (
                <div>
                    <Typography>Email: {email}</Typography>
                    { JSON.parse(data.discord.getuser).verified ? (<Typography value='h2'>User is verified</Typography>) : (<Typography value='h2'>User is not verified!</Typography>)}
                </div>
            );
        }
    }

    logout() {
        this.showModal('');
        updateStore({
            user: {
                loggedin: false,
                token: ''
            }
        });
    }

    updateField(field, { target: { value }}) {
        this.setState(prev => ({ fields: { ...prev.fields, [field]: value }}));
    }

    saveChanges() {
        this.showModal('');
        // eslint-disable-next-line no-console
        console.log(this.state.fields);
    }
}

export default mapStatesToProps(graphql(get_user_obj,{
    options: (props) => ({ variables: { token: props.user.token } })
})(withStyles(styles)(Navigation)), state => {
    return {
        user: state.user
    };
});
