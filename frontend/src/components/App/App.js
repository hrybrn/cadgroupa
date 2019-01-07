import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { initializeStore } from 'fluxible-js';
import { mapStatesToProps } from 'react-fluxible';

import Navigation from 'components/Navigation/Navigation';

initializeStore({
    initialStore: {
        user: {
            token: '',
            loggedin: false
        },
        search: {
            state: '',
            selectedGameID: '',
            selectedMode: ''
        },
        theme: 'light'
    },   
    persist: {
        useJSON: false,
        syncStorage: window.localStorage,
        restore: savedStore => ({
            user: savedStore.user,
            visitedSiteBefore: savedStore.visitedSiteBefore,
            theme: savedStore.theme
        })
    }
});

const themes = {
    light: {
        type: 'light',
        primary: {
            main: '#303f9f',
        },
        secondary: {
            main: '#303f9f',
        }
    },
    dark: {
        type: 'dark',
        primary: {
            main: '#00e3f7',
        },
        secondary: {
            main: '#303f9f',
        }
    }
};

class App extends Component {
    render() {
        const theme = createMuiTheme({
            palette: themes[this.props.theme],
            typography: {
                useNextVariants: true,
            }
        });

        return (
            <MuiThemeProvider theme={theme}>
                <Navigation/>
            </MuiThemeProvider>
        );
    }
}

export default mapStatesToProps(App, state => ({
    theme: state.theme
}));
