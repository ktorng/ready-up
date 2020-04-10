const { gql, PubSub, withFilter } = require('apollo-server');

const pubsub = new PubSub();
const USER_UPDATED = 'USER_UPDATED';

module.exports = {
    schema: gql`
        type User {
            id: ID!
            name: String!
            email: String!
            players: [Player]! # list of player objects associated with this user id
        } 
        
        type Player {
            id: ID!
            userId: ID!
            gameId: ID!
            status: PlayerStatus!
            statusMessage: String!
            playerState: String
        }
        
        extend type Query {
            me: User
            user(userId: ID!): User
        }

        extend type Mutation {
            updatePlayer(
                userId: ID!
                gameId: ID!
                status: PlayerStatus
                statusMessage: String
            ): PlayerUpdateResponse!
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

        type PlayerUpdateResponse {
            success: Boolean!
            message: String
            user: User
        }

        enum PlayerStatus {
            WAITING
            READY
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
                console.log(user)

                if (user) {
                    return {
                        token: new Buffer(email).toString('base64'),
                        user
                    };
                }
            },
            updatePlayer: async (_, { userId, gameId, ...values }, { dataSources }) => {
                const { dataValues: user } = await dataSources.userAPI.updatePlayer(values, { id: userId });
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
