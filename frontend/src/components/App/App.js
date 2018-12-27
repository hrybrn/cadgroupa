import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { initializeStore } from 'fluxible-js';

import LeftPanel from '../LeftPanel/LeftPanel';
import Login from '../Auth/Login';
import Auth from '../Auth/Auth';
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
                <Route path='/auth' component={Auth}/>
                <Route path='/login' component={Login}/>
                <Route exact path='/' component={LeftPanel}/>
            </MuiThemeProvider>
        );
    }
}

export default App;
