const { DataSource } = require('apollo-datasource');
const { get, pick } = require('lodash');

const {
    game: { generateAccessCode },
    selectors,
} = require('../utils');

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

    async createGame({ size, name, description, type }) {
        const userId = get(this.context, 'user.id');

        if (!userId) return;

        try {
            const accessCode = generateAccessCode();
            const game = await this.store.games.create({
                size,
                name,
                description,
                accessCode,
                type,
            });

            await this.store.gameUsers.create({
                gameId: get(game, 'dataValues.id'),
                userId,
                isHost: true,
            });

            return game;
        } catch (e) {
            console.error(e);
        }
    }

    async getGames(options = { visibility: 'PUBLIC' }) {
        const games = await this.store.games.findAll({
            where: options,
        });

        return games.map(selectors.gameReducer);
    }

    /**
     * Gets a game record given query options
     */
    async getGame(options) {
        return selectors.gameReducer(
            await this.store.games.findOne({
                where: options,
            })
        );
    }

    /**
     * Gets players queried by options
     */
    getGameUsers(options) {
        return this.store.gameUsers.findAll({ where: options });
    }

    /**
     * Creates a join record for gameId and current userId and returns the player
     */
    async joinGame({ gameId }, allowDuplicate = false) {
        const userId = get(this.context, 'user.id');

        if (!userId) return;

        const players = allowDuplicate
            ? await this.store.gameUsers.create(
                  {
                      gameId,
                      userId,
                  },
                  { returning: true }
              )
            : await this.store.gameUsers.findOrCreate({
                  where: { gameId, userId },
              });
        const player = players && players[0];

        if (allowDuplicate) {
            return;
        }
        return selectors.playerReducer(
            await this.store.gameUsers.findOne({
                where: { id: player.id },
                include: [this.store.users],
            })
        );
    }

    /**
     * Updates a game record's values queried by options
     */
    async updateGame(values, options) {
        const updated = await this.store.games.update(values, { where: options });

        if (updated[0]) {
            return selectors.gameReducer(await this.store.games.findOne({ where: options }));
        }
    }

    /**
     * Updates a player record's values queried by options
     */
    async updateGameUser(values, options) {
        const updated = await this.store.gameUsers.update(values, { where: options });

        if (updated[0]) {
            return this.store.gameUsers.findOne({ where: options });
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
}

module.exports = GameAPI;
