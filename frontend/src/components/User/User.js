import React, { Component } from 'react';
import { mapStatesToProps } from 'react-fluxible';
import { CircularProgress } from '@material-ui/core';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Redirect } from 'react-router-dom';


export const GET_USERNAME = gql`
    query {
        discord {
            getusername(token: "Example Token")
        }
    }
`;

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
        } else {return (<div><h1>Welcome, {data.discord.getusername}</h1><h1>Current Token{this.props.user.token}</h1></div>);}
    }
}

export default graphql(GET_USERNAME)(mapStatesToProps(User, state => {
    return {
        user: state.user
    };
}));