import React, { Component } from 'react';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

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
                <Navigation />
            </MuiThemeProvider>
        );
    }
}

export default App;
