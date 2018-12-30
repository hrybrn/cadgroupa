import React, { Component } from 'react';
import { mapStatesToProps } from 'react-fluxible';
import { CircularProgress } from '@material-ui/core';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';


export const GET_USERNAME = gql`
    query {
        discord {
            getusername(token: "Example Token")
        }
    }
`;

class User extends Component {

    state = {
        username: 0,
        user: {
            token: '',
            loggedin: 0
        }
    };

    render(){
        return (
            <div>
                <h1>This is a filler for Harry being an idiot</h1>
                {(this.usernameData(this.props.data))}
            </div>
        );
    }

    usernameData(data) {
        if (data.loading) {
            return (<div><CircularProgress/></div>);
        } else {return (<div><h1>Welcome, {data.discord.getusername}</h1></div>);}
    }
}

export default graphql(GET_USERNAME)(mapStatesToProps(User, state => {
    return {
        user: state.user
    };
}));