import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';
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
        theme: 'dark'
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
        secondary: indigo
    },
    dark: {
        type: 'dark',
        primary: {
            main: '#303f9f',
        },
        secondary: indigo
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
