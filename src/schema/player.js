const { gql, PubSub, withFilter } = require('apollo-server');

const { matchId } = require('../utils/game');

const pubsub = new PubSub();
const events = {
    PLAYER_JOINED: 'PLAYER_JOINED',
    PLAYER_LEFT: 'PLAYER_LEFT',
    PLAYER_UPDATED: 'PLAYER_UPDATED',
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
            playerState: String
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
            playerLeft(gameId: ID!): PlayerLeftPayload
            playerUpdated(gameId: ID!, currentPlayerId: ID!): PlayerUpdatedPayload!
        }

        type PlayerLeftPayload {
            gameId: ID!
            playerId: ID!
            hostId: ID
            isDeleted: Boolean!
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

        type PlayerUpdateResponse {
            success: Boolean!
            message: String
            player: Player
        }

        enum PlayerStatus {
            WAITING
            READY
        }
    `,
    resolvers: {
        Mutation: {
            updatePlayer: async (_, { playerId, gameId, ...values }, { dataSources }) => {
                const player = await dataSources.userAPI.updatePlayer(values, { id: playerId });
                await pubsub.publish(events.PLAYER_UPDATED, { playerUpdated: { gameId, player } });
                console.log(player)

                return {
                    success: !!player,
                    player
                };
            }
        },
        Subscription: {
            playerJoined: {
                // subscribe only to matching game id
                subscribe: withFilter(
                    () => pubsub.asyncIterator(events.PLAYER_JOINED),
                    (payload, variables) => matchId(payload.playerJoined.gameId, variables.gameId)
                )
            },
            playerLeft: {
                subscribe: withFilter(
                    () => pubsub.asyncIterator(events.PLAYER_LEFT),
                    (payload, variables) => matchId(payload.playerLeft.gameId, variables.gameId)
                )
            },
            playerUpdated: {
                // subscribe only to matching game id
                subscribe: withFilter(
                    () => pubsub.asyncIterator(events.PLAYER_UPDATED),
                    (payload, variables) => matchId(payload.playerUpdated.gameId, variables.gameId) &&
                        matchId(payload.playerUpdated.player.id, variables.currentPlayerId)
                )
            }
        }
    }
};
