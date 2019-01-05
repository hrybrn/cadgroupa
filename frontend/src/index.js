import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from 'serviceWorker';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import App from 'components/App/App';

// eslint-disable-next-line no-undef
const uri = process.env.REACT_APP_GRAPHQL_ENDPOINT;
const client = new ApolloClient({ uri });

ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <App/>
        </ApolloProvider>
    </BrowserRouter>,
    document.getElementById('root'));

serviceWorker.unregister();
