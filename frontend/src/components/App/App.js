import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Login from 'components/Auth/Login';
import Navigation from 'components/Navigation/Navigation';

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
        return (
            <MuiThemeProvider theme={this.theme}>
                <Route exact path="/" component={Login}/>
                <RightPanel/>
                <Navigation/>
            </MuiThemeProvider>
        );
    }
}

export default App;
