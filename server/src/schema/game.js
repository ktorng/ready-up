const { gql, PubSub, withFilter } = require('apollo-server');
const { get, isEmpty } = require('lodash');

const pubsub = new PubSub();
const events = {
    PLAYER_JOINED: 'PLAYER_JOINED',
    PLAYER_LEFT: 'PLAYER_LEFT'
};

const schema = gql`
    type Game {
        id: ID!
        hostId: String!
        accessCode: String!
        status: GameStatus!
        name: String!
        description: String!
        size: Int!
        users: [User]
    }

    extend type Query {
        games: [Game]!
        game(accessCode: String!): Game
    }

    extend type Mutation {
        createGame(size: Int!, description: String!, name: String!): GameUpdateResponse!
        joinGame(accessCode: String!): GameUpdateResponse!
        leaveGame(gameId: ID!): GameUpdateResponse!
        updateGame(gameId: ID!, status: GameStatus): GameUpdateResponse!
        deleteGame(gameId: ID!): GameUpdateResponse!
        startGame(type: GameType, gameId: ID!): GameUpdateResponse!
    }

    extend type Subscription {
        playerJoined(gameId: ID!): PlayerJoinedPayload
        playerLeft(gameId: ID!): PlayerLeftPayload
    }

    type PlayerLeftPayload {
        gameId: ID!
        userId: ID!
        hostId: ID
        isDeleted: Boolean!
    }

    type PlayerJoinedPayload {
        gameId: ID!
        user: User!
        isNew: Boolean!
    }

    type GameUpdateResponse {
        success: Boolean!
        message: String
        game: Game
    }

    enum GameStatus {
        WAITING
        IN_PROGRESS
        COMPLETED
    }

    enum GameVisibility {
        PUBLIC
        PRIVATE
    }

    enum GameType {
        GENERIC
    }
`;

const resolvers = {
    Game: {
        // get users in a game using the root object's id (game id)
        users: async ({ id }, _, { dataSources }) => {
            // const gameUsers = await dataSources.gameAPI.getGameUsers({ gameId: id });

            return dataSources.userAPI.getPlayers(id);
        }
    },
    Query: {
        games: (_, __, { dataSources }) => dataSources.gameAPI.getGames(),
        game: (_, { accessCode }, { dataSources }) => dataSources.gameAPI.getGame({ accessCode })
    },
    Mutation: {
        createGame: async (_, { name, size, description }, { dataSources }) => {
            const game = await dataSources.gameAPI.createGame({ size, name, description });

            return {
                success: !!game,
                message: game
                    ? 'Successfully created game'
                    : `Failed to create game: ${name} (${size})`,
                game
            };
        },
        joinGame: async (_, { accessCode }, { dataSources, user }) => {
            const game = await dataSources.gameAPI.getGame({ accessCode });

            // did not find game
            if (isEmpty(game)) {
                return {
                    success: false,
                    message: `Failed to find game with access code: ${accessCode}`,
                    game: null
                };
            }

            const gameUsers = await dataSources.gameAPI.getGameUsers({ gameId: game.id });
            const isNew = gameUsers.findIndex((gu) => gu.userId === user.id) === -1;

            // if full and user is not currently in this game
            if (gameUsers.length === game.size && isNew) {
                return {
                    success: false,
                    message: `Failed to join game with accessCode: ${accessCode}. Game is currently full.`,
                    game: null
                };
            }

            await dataSources.gameAPI.joinGame({ gameId: game.id });
            await pubsub.publish(events.PLAYER_JOINED, {
                playerJoined: { gameId: game.id, user, isNew }
            });

            return {
                success: true,
                message: 'Successfully joined game',
                game
            };
        },
        /**
         * Current user leaves game. If user was the only player, deletes the game, otherwise
         * publishes a playerLeft event. If user was the host, passes host to next player.
         */
        leaveGame: async (_, { gameId }, { dataSources, user }) => {
            try {
                const players = await dataSources.gameAPI.getGameUsers({ gameId });
                let game = await dataSources.gameAPI.getGame({ id: gameId });
                let hostId = game.hostId;

                await dataSources.gameAPI.deleteGameUsers({ userId: user.id, gameId });

                if (players.length === 1) {
                    await dataSources.gameAPI.deleteGame({ id: gameId });
                    game = null;
                } else {
                    const nextHost = players.find((player) => player.userId !== game.hostId);
                    // pass host
                    if (user.id === game.hostId) {
                        await dataSources.gameAPI.updateGame(
                            { hostId: nextHost.userId },
                            { id: gameId }
                        );
                        hostId = nextHost.userId;
                    }
                }

                await pubsub.publish(events.PLAYER_LEFT, {
                    playerLeft: {
                        gameId,
                        userId: user.id,
                        isDeleted: !game,
                        hostId
                    }
                });

                return { success: true };
            } catch (e) {
                console.error(e);
                return { success: false };
            }
        },
        updateGame: async (_, { gameId, status }, { dataSources }) => {
            const game = await dataSources.gameAPI.updateGame({ status }, { id: gameId });

            return {
                success: !!game,
                game
            };
        },
        deleteGame: async (_, { gameId }, { dataSources }) => {
            // delete gameUsers first, then delete the game
            await dataSources.gameAPI.deleteGameUsers({ gameId });
            const deletedGame = await dataSources.gameAPI.deleteGame({ id: gameId });

            // TODO: handle partial failure
            return {
                success: deletedGame
            };
        }
    },
    Subscription: {
        playerJoined: {
            // subscribe only to matching game id
            subscribe: withFilter(
                () => pubsub.asyncIterator(events.PLAYER_JOINED),
                (payload, variables) =>
                    parseInt(payload.playerJoined.gameId, 10) === parseInt(variables.gameId, 10)
            )
        },
        playerLeft: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(events.PLAYER_LEFT),
                (payload, variables) =>
                    parseInt(payload.playerLeft.gameId, 10) === parseInt(variables.gameId, 10)
            )
        }
    }
};

module.exports = {
    schema,
    resolvers
};
