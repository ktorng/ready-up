const { DataSource } = require('apollo-datasource');
const { get } = require('lodash');
const isEmail = require('isemail');

const { store, selectors } = require('../utils');

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

        const user = await this.store.users.findOne({ where: { email } });

        return user && selectors.userReducer(user);
    }

    /**
     * Gets players (gameUser join records) queried by options
     */
    async getPlayers(options) {
        const players = await this.store.gameUsers.findAll({
            where: options,
            include: [store.users],
        });

        return players.map(selectors.playerReducer);
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
    async updatePlayer(values, options) {
        const updated = await this.store.gameUsers.update(values, { where: options });

        if (updated[0]) {
            return selectors.playerReducer(await this.store.gameUsers.findOne({
                where: options,
                include: [store.users]
            }));
        }
    }

}

module.exports = UserAPI;
