const { get } = require('lodash');
const { DataSource } = require('apollo-datasource');
const isEmail = require('isemail');

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
    async findOrCreateUser({ email: emailArg } = {}) {
        const email = get(this.context, ['user', 'email']) || emailArg;

        if (!email || !isEmail.validate(email)) {
            return null;
        }

        const users = await this.store.users.findOrCreate({ where: { email }});

        return get(users, 0);
    }
}
