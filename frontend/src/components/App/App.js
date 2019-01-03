import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { initializeStore } from 'fluxible-js';

import Navigation from 'components/Navigation/Navigation';

initializeStore({
    initialStore: {
        user: {
            token: '',
            loggedin: 0
        },
    },   
    persist: {
        useJSON: false,
        syncStorage: window.localStorage,
        restore: savedStore => ({
            user: savedStore.user
        })
    }
});

class App extends Component {
    theme = createMuiTheme({
        palette: {
            type: 'light',
        },
        typography: {
            useNextVariants: true,
        },
    });

    render() {		
        // Consider returning left panel for the default route here a placeholder.
        // In reality the main route would return the central component.
        return (
            <MuiThemeProvider theme={this.theme}>
                <Navigation/>
            </MuiThemeProvider>
        );
    }
}

export default App;
