import React, { Component } from 'react';
import './App.css';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Navigation from '../Navigation/Navigation';
import RightPanel from '../RightPanel/RightPanel';

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
                <Navigation />
                <RightPanel />
            </MuiThemeProvider>
        );
    }
}

export default App;
