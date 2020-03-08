const { DataSource } = require('apollo-datasource');
const { get, pick } = require('lodash');

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

    async createGame({ size, name, description }) {
        const userId = get(this.context, 'user.id');

        if (!userId) return;

        try {
            const accessCode = generateAccessCode();
            const game = await this.store.games.create({
                hostId: userId,
                size,
                name,
                description,
                accessCode
            });

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

    async getGames(options = { visibility: 'PUBLIC' }) {
        const games = await this.store.games.findAll({
            where: options
        });

        return games.map(this.gameReducer);
    }

    /**
     * Gets a game record given query options
     */
    async getGame(options) {
        return this.gameReducer(await this.store.games.findOne({
            where: options
        }));
    }

    /**
     * Gets current users in given gameId
     */
    getGameUsers({ gameId }) {
        return this.store.gameUsers.findAll({ where: { gameId } });
    }

    /**
     * Creates a join record for gameId and current userId
     */
    joinGame({ gameId }) {
        const userId = get(this.context, 'user.id');

        if (!userId) return;

        return this.store.gameUsers.findOrCreate({ where: { gameId, userId } });
    }

    /**
     * Updates a game record's values queried by options
     */
    async updateGame(values, options) {
        const updated = await this.store.games.update(values, { where: options});

        if (updated[0]) {
            return this.store.games.findOne({ where: options });
        }
    }

    /**
     * Deletes gameUser records for a given options query
     */
    async deleteGameUsers(options) {
        const deleted = await this.store.gameUsers.destroy({ where: options });

        return !!deleted[0];
    }

    /**
     * Deletes game records for a given options query
     */
    async deleteGame(options) {
        const deleted = await this.store.games.destroy({ where: options });

        return !!deleted[0];
    }

    gameReducer(game) {
        return pick(game, [
            'id',
            'hostId',
            'accessCode',
            'name',
            'status',
            'size',
            'description',
        ]);
    }
}

module.exports = GameAPI;
