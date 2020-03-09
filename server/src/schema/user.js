const schema = `
    type User {
        id: ID!
        name: String!
        email: String!
        status: UserStatus!
        statusMessage: String!
    }

    extend type Query {
        me: User
    }

    extend type Mutation {
        updateUser(userId: ID!, status: UserStatus, statusMessage: String): UserUpdateResponse!
        login(name: String, email: String!): LoginResponse
    }
    
    type LoginResponse {
        token: String
        user: User
    }

    type UserUpdateResponse {
        success: Boolean!
        message: String
        user: User
    }

    enum UserStatus {
        WAITING
        READY
    }
`;

const resolvers = {
    Query: {
        me: (_, __, { user }) => user
    },
    Mutation: {
        login: async (_, { name, email }, { dataSources }) => {
            const user = await dataSources.userAPI.upsertUser({ name, email });

            if (user) {
                return {
                    token: new Buffer(email).toString('base64'),
                    user: user.dataValues
                };
            }
        },
        updateUser: async (_, { userId, ...values }, { dataSources }) => {
            const user = await dataSources.userAPI.updateUser(
                values,
                { id: userId }
            );

            return {
                success: !!user,
                user
            };
        }
    }

};

module.exports = {
    schema,
    resolvers
};
