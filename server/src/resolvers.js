const { generateAccessCode } = require('./utils/game');

module.exports = {
    Mutation: {
        login: async (_, { email }, { dataSources }) => {
            const user = await dataSources.userAPI.findOrCreateUser({ email });

            if (user) {
                return new Buffer(email).toString('base64');
            }
        },
        createGame: async (_, { userId, size, name}, { dataSources }) => {
            const game = await dataSources.gameAPI.create({ userId, size, name });

            return {
                success: !!game,
                message: !!game ? 'Game created successfully' : `Game: ${name} (${size}) failed to create for user: ${userId}`,
                game
            };
        }
    }

};
