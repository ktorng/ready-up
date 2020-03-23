const { DataSource } = require('apollo-datasource');
const { get, pick } = require('lodash');
const { Sequelize } = require('sequelize');
const isEmail = require('isemail');

const store = require('../utils/store');

class UserAPI extends DataSource {
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

    /**
     * User can be called with an argument that includes email, but it doesn't have to be. If the user is already on the
     * context, it will use that user instead.
     */
    async upsertUser({ name, email: emailArg } = {}) {
        const email = get(this.context, ['user', 'email']) || emailArg;

        if (!email || !isEmail.validate(email)) {
            return null;
        }

        await this.store.users.upsert({ name, email }, { returning: true });

        return this.store.users.findOne({ where: { email } })
    }

    /**
     * Gets user records queried by list of userIds
     */
    async getPlayers(gameId) {
        const players = await this.store.gameUsers.findAll({
            where: { gameId },
            include: [store.users],
        });

        return players.map(player => this.userReducer(player.user));
    }

    /**
     * Gets a single user record queried by options
     */
    getUser(options) {
        return this.store.users.findOne({ where: options });
    }

    /**
     * Updates a user record and then returns the updated record
     */
    async updateUser(values, options) {
        const updated = await this.store.users.update(values, { where: options });

        if (updated[0]) {
            return this.store.users.findOne({ where: options });
        }
    }

    userReducer(user) {
        return pick(user, [
            'id',
            'email',
            'name',
            'status',
            'statusMessage',
            'playerState'
        ]);
    }
}

module.exports = UserAPI;
