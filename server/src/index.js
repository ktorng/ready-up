const express = require('express');
const cors = require('cors');
const http = require('http');
const { ApolloServer } = require('apollo-server-express');
const { get } = require('lodash');
const isEmail = require('isemail');

const schema = require('./schema');
const store = require('./utils/store');

const UserAPI = require('./datasources/user');
const GameAPI = require('./datasources/game');

const app = express();
app.use(cors());

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('../client/build'));
}

// set up datasources our resolvers need
const dataSources = () => ({
    userAPI: new UserAPI({ store }),
    gameAPI: new GameAPI({ store }),
});

// function that sets up global context for each resolver, using the request
const context = async ({ req, connection }) => {
    // context for subscriptions
    if (connection) {
        return { ...connection.context, dataSources: dataSources() };
    }

    // simple auth check on every request
    const auth = get(req, ['headers', 'authorization']) || '';
    const email = new Buffer(auth, 'base64').toString('ascii');

    // if the email isn't formatted validly, return null for user
    if (!isEmail.validate(email)) {
        return { user: null };
    }

    const users = await store.users.findOrCreate({ where: { email }});
    const user = get(users, 0);

    return {
        user: { ...user.dataValues },
    };
};

const server = new ApolloServer({
    schema,
    dataSources,
    context,
    introspection: true,
    playground: true,
    subscriptions: {
        path: '/subscriptions',
    },
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: 8000 }, async () => {
    try {
        await store.db.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    console.log(`Server ready at ${server.graphqlPath}`);
    console.log(`Subscriptions ready at ${server.subscriptionsPath}`);
});
