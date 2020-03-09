import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { persistCache } from 'apollo-cache-persist';
import { ApolloProvider } from '@apollo/react-hooks';

import App from './App';
import { resolvers, typeDefs } from './resolvers';
import * as serviceWorker from './serviceWorker';

import './index.css';

const cache = new InMemoryCache();

const authLink = setContext((_, { headers }) => ({
    // get auth token if it exists and return headers to context for httpLink to read
    headers: {
        ...headers,
        authorization: localStorage.getItem('readyup-token'),
    },
}));

// http link to graphql
const httpLink = authLink.concat(new HttpLink({
    uri: 'http://localhost:4000',
    credentials: 'same-origin',
}));

// websocket link to subscriptions
const wsLink = new WebSocketLink({
    uri: 'ws://localhost:4000/subscriptions',
    options: {
        reconnect: true,
    },
});

// split links to send data to each link based on operation type
const link = split(
    // split based on operation type
    ({ query }) => {
        const definition = getMainDefinition(query);

        return definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription';
    },
    wsLink,
    httpLink
);

const client = new ApolloClient({
    link: ApolloLink.from([
        onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors)
                graphQLErrors.forEach(({ message, locations, path }) =>
                    console.log(
                        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
                    ),
                );
            if (networkError) console.log(`[Network error]: ${networkError}`);
        }),
        link,
    ]),
    cache,
    typeDefs,
    resolvers,
});

cache.writeData({
    data: {
        isLoggedIn: !!localStorage.getItem('readyup-token'),
    },
});

// set up persisted client cache
const setupAndRender = async () => {
    await persistCache({
        cache,
        storage: localStorage
    });

    ReactDOM.render(
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>,
        document.getElementById('root')
    );
};

setupAndRender();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
