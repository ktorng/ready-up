const { generateAccessCode } = require('./utils/game');

module.exports = {
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
        }
    }
};
