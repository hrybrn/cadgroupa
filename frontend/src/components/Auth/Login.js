import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { mapStatesToProps } from 'react-fluxible';
class Login extends Component{
    render() {
        if (this.props.user.loggedin) {
            return <Redirect to='/' />;
        } else {
            window.location='https://discordapp.com/api/oauth2/authorize?client_id=519526061864779808&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fauth&response_type=code&scope=identify%20email%20connections%20guilds.join%20guilds';
            return <Fragment />;
        }
    }
}
export default mapStatesToProps(Login, state => {
    return {
        user: state.user
    };
});
