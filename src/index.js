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

const isProdEnv = process.env.NODE_ENV === 'production';
const app = express();
app.use(cors());

const socketUsers = {};

if (isProdEnv) {
    app.use(express.static('client/build'));
    app.get('*', function(req, res) {
        res.sendFile('client/build/index.html', { root: process.cwd() });
    });
}

// set up datasources our resolvers need
const dataSources = () => ({
    userAPI: new UserAPI({ store }),
    gameAPI: new GameAPI({ store }),
});

// function that sets up global context for each resolver, using the request
const context = async ({ req, connection, payload }) => {
    let user;
    // context for subscriptions
    if (connection) {
        user = await getUser(payload.auth);
        socketUsers[connection.context.socketKey] = user;

        return { ...connection.context, dataSources: dataSources(), user };
    }

    // context for graphql
    user = await getUser(get(req, 'headers.authorization'));

    return { user };
};

const server = new ApolloServer({
    schema,
    dataSources,
    context,
    introspection: true,
    playground: true,
    subscriptions: {
        path: '/subscriptions',
        onConnect: async (connectionParams, socket) => {
            const socketKey = get(socket, ['upgradeReq', 'headers', 'sec-websocket-key']);
            console.log('User connected with socket key: ', socketKey);

            return {
                dataSources: dataSources(),
                socketKey,
            };
        },
        onDisconnect: async (socket, context) => {
            const { socketKey } = await context.initPromise;
            const user = get(socketUsers, socketKey);

            try {
                if (user) {
                    console.log('User disconnected with id: ', user.id);
                }
                delete socketUsers[socketKey];
            } catch (e) {
                console.error(e);
            }
        },
    },
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: process.env.PORT || 8000 }, async () => {
    try {
        await store.db.authenticate();
        if (isProdEnv) {
            await store.db.sync({ force: true });
        }
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    console.log(`Server ready at ${server.graphqlPath}`);
    console.log(`Subscriptions ready at ${server.subscriptionsPath}`);
});

async function getUser(authToken) {
    if (!authToken) return null;

    const email = new Buffer(authToken, 'base64').toString('ascii');

    // if the email isn't formatted validly, return null for user
    if (!isEmail.validate(email)) return null;

    const users = await store.users.findOrCreate({ where: { email } });
    return get(users, '0.dataValues');
}
