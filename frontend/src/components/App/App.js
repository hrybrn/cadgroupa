import React, { Component } from 'react';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

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
                <Navigation />
                <RightPanel />
            </MuiThemeProvider>
        );
    }
}

export default App;
