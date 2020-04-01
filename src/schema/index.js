const { gql, makeExecutableSchema } = require('apollo-server');
const { merge } = require('lodash');

const { schema: gameSchema, resolvers: gameResolvers } = require('./game');
const { schema: userSchema, resolvers: userResolvers } = require('./user');
const { schema: crewSchema, resolvers: crewResolvers } = require('./crew');

// init for modules to extend
const rootSchema = gql`
    type Query {
        _empty: String
    }
    
    type Mutation {
        _empty: String
    }
    
    type Subscription {
        _empty: String
    }
`;

module.exports = makeExecutableSchema({
    typeDefs: [rootSchema, gameSchema, userSchema, crewSchema],
    resolvers: merge(gameResolvers, userResolvers, crewResolvers)
});
