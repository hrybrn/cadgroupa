import React, { Component } from 'react';


export const AuthContext = React.createContext('');
export const AuthProvider = class AuthProvider extends Component {
    state = {
        Token: 'x.x.x.'
    }

    render() {
        return (
            <AuthContext.Provider value={{
                state: this.state,
                token: 'xxxxx'
            }}>
                {this.props.children}
            </AuthContext.Provider>
        );
    }
};