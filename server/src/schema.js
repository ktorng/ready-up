const { gql } = require('apollo-server');

const typeDefs = gql`
    type Game {
        id: ID!
        host: [User]!
        accessCode: String!
        status: GameStatus
        size: Int
    }

    type User {
        id: ID!
        email: String!
        game: Game
        userStatus: UserStatus
    }

    type Query {
        usersByGame(gameId: ID!): [User]
        gameByAccessCode(accessCode: String!): Game
        me: User
    }

    type Mutation {
        createGame(
            userId: ID!, 
            size: Int!,
            name: String!
        ): GameUpdateResponse!
        updateGame(gameId: ID!, status: GameStatus): GameUpdateResponse!
        deleteGame(gameId: ID!): GameUpdateResponse!
        updateUser(userId: ID!, status: UserStatus, gameId: ID): UserUpdateResponse!
        login(email: String): String # login token
    }

    type GameUpdateResponse {
        success: Boolean!
        message: String
        game: Game
    }

    type UserUpdateResponse {
        success: Boolean!
        message: String
        user: User
    }

    enum GameStatus {
        WAITING
        IN_PROGRESS
        COMPLETED
    }

    enum UserStatus {
        WAITING
        READY
    }
`;

module.exports = typeDefs;
