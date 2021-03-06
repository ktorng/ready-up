const { gql } = require('apollo-server');
const { isEmpty } = require('lodash');

const { events: playerEvents } = require('./player');
const { store: { pubsub } } = require('../utils');

const schema = gql`
    type Game {
        id: ID!
        accessCode: String!
        status: GameStatus!
        name: String!
        description: String!
        size: Int!
        players: [Player]! # list of player objects associated with this game id
        type: GameType
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
        DEBUG
        CREW
    }
`;

const resolvers = {
    Game: {
        // get associated player objects by using the root object's id (game id)
        players: async ({ id }, _, { dataSources }) => {
            return dataSources.userAPI.getPlayers({ gameId: id });
        },
        // parse gameState for response
        gameState: (game) => JSON.parse(game.gameState || null)
    },
    Query: {
        games: (_, __, { dataSources }) => dataSources.gameAPI.getGames(),
        game: (_, { accessCode }, { dataSources }) => dataSources.gameAPI.getGame({ accessCode })
    },
    Mutation: {
        createGame: async (_, { name, size, description }, { dataSources }) => {
            const game = await dataSources.gameAPI.createGame({
                size,
                name,
                description,
                type: name === 'debug' ? 'DEBUG' : 'CREW',
            });

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

            const player = await dataSources.gameAPI.joinGame({ gameId: game.id });
            await pubsub.publish(playerEvents.PLAYER_JOINED, {
                playerJoined: { gameId: game.id, player, isNew }
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
                const currentPlayer = players.find(player => player.userId === user.id);
                let nextHost;

                await dataSources.gameAPI.deleteGameUsers({ userId: user.id, gameId });

                if (players.length === 1) {
                    await dataSources.gameAPI.deleteGame({ id: gameId });
                } else {
                    // pass host
                    if (currentPlayer.isHost) {
                        nextHost = players.find(player => player.id !== currentPlayer.id);
                        await dataSources.gameAPI.updateGameUser({ isHost: true }, { id: nextHost.id });
                    }

                    await pubsub.publish(playerEvents.PLAYER_LEFT, {
                        playerLeft: {
                            gameId,
                            playerId: currentPlayer.id,
                            hostId: nextHost && nextHost.id
                        }
                    });
                }

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
};

module.exports = {
    schema,
    resolvers
};
