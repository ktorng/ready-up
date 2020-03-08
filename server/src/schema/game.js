const { isEmpty } = require('lodash');

const schema = `
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
        updateGame(gameId: ID!, status: GameStatus): GameUpdateResponse!
        deleteGame(gameId: ID!): GameUpdateResponse!
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
`;

const resolvers = {
    Query: {
        games: (_, __, { dataSources }) =>
            dataSources.gameAPI.getGames(),
        game: async (_, { accessCode }, { dataSources }) => {
            const game = await dataSources.gameAPI.getGame({ accessCode });

            if (!game) return;

            const gameUsers = await dataSources.gameAPI.getGameUsers({ gameId: game.id });
            const users = await dataSources.userAPI.getUsers(gameUsers.map(gameUser => gameUser.userId));

            return {
                ...game,
                users
            }
        },
    },
    Mutation: {
        createGame: async (_, { name, size, description }, { dataSources }) => {
            const game = await dataSources.gameAPI.createGame({ size, name, description });

            return {
                success: !!game,
                message: game ? 'Successfully created game' : `Failed to create game: ${name} (${size})`,
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

            // if full and user is not currently in this game
            if (gameUsers.length === game.size &&
                gameUsers.findIndex(gu => gu.userId === user.id) === -1) {
                return {
                    success: false,
                    message: `Failed to join game with acccessCode: ${accessCode}. Game is currently full.`,
                    game: null
                };
            }

            await dataSources.gameAPI.joinGame({ gameId: game.id });

            return {
                success: true,
                message: 'Successfully joined game',
                game
            };
        },
        updateGame: async (_, { gameId, status }, { dataSources }) => {
            const game = await dataSources.gameAPI.updateGame(
                { status },
                { id: gameId }
            );

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
        },
    }
};

module.exports = {
    schema,
    resolvers
};
