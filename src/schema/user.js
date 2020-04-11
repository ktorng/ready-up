const { gql } = require('apollo-server');

module.exports = {
    schema: gql`
        type User {
            id: ID!
            name: String!
            email: String!
            players: [Player]! # list of player objects associated with this user id
        } 
        
        extend type Query {
            me: User
            user(userId: ID!): User
        }

        extend type Mutation {
            login(name: String, email: String!): LoginResponse
        }

        type LoginResponse {
            token: String
            user: User
        }
    `,
    resolvers: {
        User: {
            // get associated player objects by using the root object's id (user id)
            players: async ({ id }, _, { dataSources }) => {
                return await dataSources.userAPI.getPlayers({ userId: id });
            }
        },
        Query: {
            me: (_, __, { user }) => user,
            user: async (_, { userId }, { dataSources }) => {
                const user = await dataSources.userAPI.getUser({ id: userId });

                return !!user && user.dataValues;
            },
        },
        Mutation: {
            login: async (_, { name, email }, { dataSources }) => {
                const user = await dataSources.userAPI.upsertUser({ name, email });

                if (user) {
                    return {
                        token: new Buffer(email).toString('base64'),
                        user
                    };
                }
            },
        },
    }
};
