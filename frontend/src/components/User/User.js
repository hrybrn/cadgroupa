import React, { Component, Fragment } from 'react';
import { mapStatesToProps } from 'react-fluxible';
import { CircularProgress } from '@material-ui/core';
import { graphql } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import { get_user_obj } from 'queries/discord.js';

class User extends Component {
    render(){
        return (
            <div>
                <h1>This is a filler for Harry being an idiot</h1>
                {this.props.user.loggedin == 1 ? (this.usernameData(this.props.data)) :
                    (<Redirect to='/login'/>)
                }
            </div>
        );
    }

    usernameData(data) {
        if (data.loading || data.discord === undefined) {
            return (<div><CircularProgress/></div>);
        } else {
            const user = JSON.parse(data.discord.getuser);
            return (
                <div>
                    <h1>Welcome, {user.username}</h1>
                    {user.verified ? (<h1>User is verified!</h1>) : (<Fragment></Fragment>)}
                </div>
            );
        }
    }
}

export default mapStatesToProps(graphql(get_user_obj,{
    options: (props) => ({ variables: { token: props.user.token } })
})(User), state => {
    return {
        user: state.user
    };
});
