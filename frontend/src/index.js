import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from 'serviceWorker';


import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import App from 'components/App/App';

const client = new ApolloClient({
    uri: 'http://localhost:4000'
});

ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <App/>
        </ApolloProvider>
    </BrowserRouter>,
    document.getElementById('root'));

serviceWorker.unregister();