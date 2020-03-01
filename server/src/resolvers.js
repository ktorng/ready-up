const { generateAccessCode } = require('./utils/game');

module.exports = {
    Query: {
        games: (_, __, { dataSources }) =>
            dataSources.gameAPI.getGames()
    },
    Mutation: {
        login: async (_, { email }, { dataSources }) => {
            const user = await dataSources.userAPI.findOrCreateUser({ email });

            if (user) {
                return new Buffer(email).toString('base64');
            }
        },
        createGame: async (_, { name, size }, { dataSources }) => {
            const game = await dataSources.gameAPI.createGame({ size, name });

            return {
                success: !!game,
                message: game ? 'Successfully created game' : `Failed to create game: ${name} (${size})`,
                game
            };
        },
        joinGame: async (_, { accessCode }, { dataSources }) => {
            const game = await dataSources.gameAPI.getGame({ accessCode });

            // did not find game
            if (!game) {
                return {
                    success: false,
                    message: `Failed to find game with access code: ${accessCode}`,
                    game: null
                };
            }

            const gameUsers = await dataSources.gameAPI.getGameUsers({ gameId: game.id });

            if (gameUsers.length === game.size) {
                return {
                    success: false,
                    message: `Failed to join game with acccessCode: ${accessCode}. Game is currently full.`,
                    game: null
                };
            }

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
                message: game ? 'Successfully updated game': `Failed to update game with gameId: ${gameId}`,
                game
            };
        }
    }
};
