import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Login from 'components/Auth/Login';
import Navigation from 'components/Navigation/Navigation';
import RightPanel from 'components/RightPanel/RightPanel';

class App extends Component {
    theme = createMuiTheme({
        palette: {
            type: 'dark',
        },
        typography: {
            useNextVariants: true,
        },
    });

    render() {		
        return (
            <MuiThemeProvider theme={this.theme}>
                <Navigation/>
                <RightPanel/>
                <Route exact path="/" component={Login}/>
            </MuiThemeProvider>
        );
    }
}

export default App;
