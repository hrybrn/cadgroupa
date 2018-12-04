import React, { Component, Fragment } from 'react';

import { Drawer, AppBar, IconButton, Menu, MenuItem, Toolbar, withStyles, Button, TextField, DialogContentText } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/MenuSharp';
import Person from '@material-ui/icons/PersonOutlineSharp';

import LeftPanel from 'components/LeftPanel/LeftPanel';
import Modal from 'components/Modal/Modal';

import matchmakr from 'assets/matchmakr.png';

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
        modal: '',
        fields: {
            email: '',
        },
    };

    render() {
        const { logo, navigation, toolbar } = this.props.classes;
        const { anchorEl, drawerOpen } = this.state;
        const accountMenuOpen = Boolean(anchorEl);

        const modal = this.renderModal();
        return (
            <Fragment>
                <AppBar className={navigation}>
                    <Toolbar>
                        <IconButton
                            color='inherit'
                            aria-label='Menu'
                            onClick={this.toggleDrawer.bind(this)}
                            className='drawerButton'
                        >
                            <MenuIcon />
                        </IconButton>
                        <img
                            src={matchmakr}
                            className={logo}
                            alt='matchma.kr logo'
                        />
                        <div className='accountMenu' >
                            <IconButton
                                aria-owns={ accountMenuOpen ? 'menu-appbar' : undefined }
                                aria-haspopup='true'
                                onClick={this.handleMenu.bind(this)}
                                color='inherit'
                                className='accountButton'
                            >
                                <Person />
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
                    </Toolbar>
                </AppBar>
                <Drawer
                    anchor='left'
                    open={drawerOpen}
                    variant='persistent'
                >
                    <div className={toolbar} />
                    <LeftPanel />
                </Drawer>
                {modal}
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
        this.setState(prev => ({ drawerOpen: !prev.drawerOpen }));
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
                        <TextField
                            autoFocus
                            margin='dense'
                            id='name'
                            label='Email Address'
                            type='email'
                            fullWidth
                            key='email'
                            onChange={this.updateField.bind(this, 'email')}
                        />
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

    logout() {
        this.showModal('');
        // eslint-disable-next-line no-console
        console.log('logout');
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

export default withStyles(styles)(Navigation);
