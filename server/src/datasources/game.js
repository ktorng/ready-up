const { DataSource } = require('apollo-datasource');
const { get } = require('lodash');

const { generateAccessCode } = require('../utils/game');

class GameAPI extends DataSource {
    constructor({ store }) {
        super();
        this.store = store;
    }

    /**
     * Function that gets called by ApolloServer when being setup. This function gets called with the datasource config
     * including things like cache and context. We'll assign this.context to the request context here, so we can know
     * about the user making requests.
     */
    initialize(config) {
        this.context = config.context;
    }

    async createGame({ size, name }) {
        const userId = get(this.context, 'user.id');

        if (!userId) return;

        try {
            const accessCode = generateAccessCode();
            const game = await this.store.games.create({
                hostId: userId,
                size,
                name,
                accessCode
            });
            console.log('game: ', game);

            await this.store.gameUsers.create({
                gameId: get(game, 'dataValues.id'),
                userId,
                isHost: true
            });

            return game;
        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = GameAPI;
