const { gql, PubSub, withFilter } = require('apollo-server');

const pubsub = new PubSub();
const USER_UPDATED = 'USER_UPDATED';

module.exports = {
    schema: gql`
        type User {
            id: ID!
            name: String!
            email: String!
            status: UserStatus!
            statusMessage: String!
        }

        extend type Query {
            me: User
            user(userId: ID!): User
        }

        extend type Mutation {
            updateUser(
                userId: ID!
                gameId: ID!
                status: UserStatus
                statusMessage: String
            ): UserUpdateResponse!
            login(name: String, email: String!): LoginResponse
        }

        extend type Subscription {
            userUpdated(gameId: ID!, currentUserId: ID!): UserUpdatedPayload!
        }
        
        type UserUpdatedPayload {
            gameId: ID!
            user: User!
        }

        type LoginResponse {
            token: String
            user: User
        }

        type UserUpdateResponse {
            success: Boolean!
            message: String
            user: User
        }

        enum UserStatus {
            WAITING
            READY
        }
    `,
    resolvers: {
        Query: {
            me: (_, __, { user }) => user,
            user: async (_, { userId }, { dataSources }) => {
                const user = await dataSources.userAPI.getUser({ id: userId });

                return !!user && user.dataValues;
            }
        },
        Mutation: {
            login: async (_, { name, email }, { dataSources }) => {
                const user = await dataSources.userAPI.upsertUser({ name, email });

                if (user) {
                    return {
                        token: new Buffer(email).toString('base64'),
                        user: user.dataValues
                    };
                }
            },
            updateUser: async (_, { userId, gameId, ...values }, { dataSources }) => {
                const { dataValues: user } = await dataSources.userAPI.updateUser(values, { id: userId });
                await pubsub.publish(USER_UPDATED, { userUpdated: { gameId, user } });

                return {
                    success: !!user,
                    user
                };
            }
        },
        Subscription: {
            userUpdated: {
                // subscribe only to matching game id
                subscribe: withFilter(
                    () => pubsub.asyncIterator(USER_UPDATED),
                    (payload, variables) => payload.userUpdated.gameId === variables.gameId &&
                        payload.userUpdated.user.id !== parseInt(variables.currentUserId, 10)
                )
            }
        }
    }
};
