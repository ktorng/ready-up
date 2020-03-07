import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient, { gql } from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import App from './App';
import { resolvers, typeDefs } from './resolvers';
import * as serviceWorker from './serviceWorker';

import './index.css';

const client = new ApolloClient({
    uri: 'http://localhost:4000',
    request: (operation) => {
        const token = localStorage.getItem('readyup-token');
        operation.setContext({
            headers: {
                authorization: token,
            },
        });
    },
    typeDefs,
    resolvers,
    clientState: {
        defaults: {
            isLoggedIn: !!localStorage.getItem('readyup-token'),
        },
    },
});

client
    .query({
        query: gql`
            query me {
                me {
                    id
                    name
                    email
                }
            }
        `
    })
    .then(res => console.log(res));

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
