import React, { Component } from 'react';
import { AuthContext } from 'components/Context/AuthContext';
class Login extends Component{
    render() {
        return (
            <AuthContext.Consumer>
                {(context) => (
                    <div>
                        <h1>Token: {context.state.Token}</h1>
                        <h1>Token 2: {context.token}</h1>
                    </div>
                )}
            </AuthContext.Consumer>
        );
    }
}

export default Login;
