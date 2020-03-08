const { makeExecutableSchema } = require('apollo-server');
const { merge } = require('lodash');

const { schema: gameSchema, resolvers: gameResolvers } = require('./game');
const { schema: userSchema, resolvers: userResolvers } = require('./user');

const rootSchema = `
    type Query {
        _empty: String
    }
    
    type Mutation {
        _empty: String
    }
`;

module.exports = makeExecutableSchema({
    typeDefs: [rootSchema, gameSchema, userSchema],
    resolvers: merge(gameResolvers, userResolvers)
});
