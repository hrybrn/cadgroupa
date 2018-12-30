import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import qs from 'query-string';
import { CircularProgress } from '@material-ui/core';
import { updateStore } from 'fluxible-js';
import { DISCORD_CLIENT, DISCORD_SECRET } from 'components/Auth/api_config_discord';

class Auth extends Component{
    state = {
        qsparsed : qs.parse(this.props.location.search, { ignoreQueryPrefix: true }),
        loading : true,
        redirect : false
    }
    constructor(props){
        super(props);
        if(!this.state.qsparsed.code) {
            this.props.history.push('/');
        }
        const serialize = (obj) => {
            var str = [];
            for (var p in obj)
                if (obj.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                }
            return str.join('&');
        };
        fetch('https://discordapp.com/api/oauth2/token?grant_type=authorization_code&'+serialize({
            // The cadgroupa/frontend/src/components/Auth/api_config_discord.js 
            // file is pinned in the https://cadgroupa.slack.com/ server
            // in the #general channel

            client_id: DISCORD_CLIENT,
            client_secret: DISCORD_SECRET,
            code: this.state.qsparsed.code,
            redirect_uri: 'http://127.0.0.1:3000/auth',
            scope: 'identify'
        }),
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded.'
            }
        }).then(response => { if (response.ok) return response; 
        }).then(response => { return response.json();
        }).then(json => { 
            updateStore({
                user: {
                    token: json['access_token'],
                    loggedin: 1
                }
            });
            this.setState({redirect: true});
        // eslint-disable-next-line no-console
        }).catch( error => { console.log(error); });
    }
    render() {
        return (this.state.redirect) ? <Redirect to='/'/> : (
            <div style={{display: 'flex', justifyContent: 'center', paddingTop: '20%'}}>
                <CircularProgress size={200} />
            </div>
        );
    }
}
export default Auth;
