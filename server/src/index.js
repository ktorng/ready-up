const { ApolloServer } = require('apollo-server');
const { get } = require('lodash');
const isEmail = require('isemail');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { createStore } = require('./utils/store');

const UserAPI = require('./datasources/user');

// creates a sequelize connection once. NOT for every request
const store = createStore();

// set up datasources our resolvers need
const dataSources = () => ({
    userAPI: new UserAPI({ store }),
});

// function that sets up global context for each resolver, using the request
const context = async ({ req }) => {
    // simple auth check on every request
    const auth = get(req, ['headers', 'authorization']) || '';
    const email = new Buffer(auth, 'base64').toString('ascii');

    // if the email isn't formatted validly, return null for user
    if (!isEmail.validate(email)) {
        return { user: null };
    }

    const users = await store.users.findOrCreate({ where: { email }});
    const user = get(users, 0);

    return { user };
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources,
    context,
    introspection: true,
    playground: true,
});

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
