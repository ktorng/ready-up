const { gql, withFilter } = require('apollo-server');

const {
    store: { pubsub },
    game: { matchId, containsId },
} = require('../utils');

const events = {
    PLAYER_JOINED: 'PLAYER_JOINED',
    PLAYER_LEFT: 'PLAYER_LEFT',
    PLAYER_UPDATED: 'PLAYER_UPDATED',
    PLAYER_CONNECTION: 'PLAYER_CONNECTION',
};

module.exports = {
    events,
    schema: gql`
        type Player {
            id: ID!
            userId: ID!
            gameId: ID!
            status: PlayerStatus!
            statusMessage: String!
            isHost: Boolean!
            name: String!
            email: String!
        }

        extend type Mutation {
            updatePlayer(
                playerId: ID!
                gameId: ID!
                status: PlayerStatus
                statusMessage: String
            ): PlayerUpdateResponse!
        }

        extend type Subscription {
            playerJoined(gameId: ID!): PlayerJoinedPayload
            playerLeft(gameId: ID!, currentPlayerId: ID!): PlayerLeftPayload
            playerUpdated(gameId: ID!, currentPlayerId: ID!): PlayerUpdatedPayload!
            playerConnection(gameId: ID!): PlayerConnectionPayload!
        }

        type PlayerLeftPayload {
            gameId: ID!
            playerId: ID!
            hostId: ID
        }

        type PlayerJoinedPayload {
            gameId: ID!
            player: Player!
            isNew: Boolean!
        }

        type PlayerUpdatedPayload {
            gameId: ID!
            player: Player!
        }

        type PlayerConnectionPayload {
            gameIds: [ID]!
            userId: ID!
            isConnected: Boolean!
        }

        type PlayerUpdateResponse {
            success: Boolean!
            message: String
            player: Player
        }

        enum PlayerStatus {
            WAITING
            READY
            DISCONNECTED
        }
    `,
    resolvers: {
        Mutation: {
            updatePlayer: async (_, { playerId, gameId, ...values }, { dataSources }) => {
                const player = await dataSources.userAPI.updatePlayer(values, { id: playerId });
                await pubsub.publish(events.PLAYER_UPDATED, { playerUpdated: { gameId, player } });

                return {
                    success: !!player,
                    player,
                };
            },
        },
        Subscription: {
            playerJoined: {
                // subscribe only to matching game id
                subscribe: withFilter(
                    () => pubsub.asyncIterator(events.PLAYER_JOINED),
                    (payload, variables) => matchId(payload.playerJoined.gameId, variables.gameId)
                ),
            },
            playerLeft: {
                subscribe: withFilter(
                    () => pubsub.asyncIterator(events.PLAYER_LEFT),
                    (payload, variables) =>
                        matchId(payload.playerLeft.gameId, variables.gameId) &&
                        !matchId(payload.playerLeft.playerId, variables.currentPlayerId)
                ),
            },
            playerUpdated: {
                // subscribe only to matching game id
                subscribe: withFilter(
                    () => pubsub.asyncIterator(events.PLAYER_UPDATED),
                    (payload, variables) =>
                        matchId(payload.playerUpdated.gameId, variables.gameId) &&
                        !matchId(payload.playerUpdated.player.id, variables.currentPlayerId)
                ),
            },
            playerConnection: {
                subscribe: withFilter(
                    () => pubsub.asyncIterator(events.PLAYER_CONNECTION),
                    (payload, variables) =>
                        containsId(payload.playerConnection.gameIds, variables.gameId)
                ),
            },
        },
    },
};
