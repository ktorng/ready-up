const { gql } = require('apollo-server');

const typeDefs = gql`
    type Game {
        id: ID!
        hostId: String!
        accessCode: String!
        status: GameStatus!
        name: String!
        description: String!
        size: Int!
        users: [User]
    }

    type User {
        id: ID!
        name: String!
        email: String!
        status: UserStatus!
        statusMessage: String!
    }

    type Query {
        games: [Game]!
        game(accessCode: String!): Game
        me: User
    }

    type Mutation {
        createGame(size: Int!, description: String!, name: String!): GameUpdateResponse!
        joinGame(accessCode: String!): GameUpdateResponse!
        updateGame(gameId: ID!, status: GameStatus): GameUpdateResponse!
        deleteGame(gameId: ID!): GameUpdateResponse!
        updateUser(userId: ID!, status: UserStatus, statusMessage: String): UserUpdateResponse!
        login(name: String, email: String!): String # login token
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

    enum GameVisibility {
        PUBLIC
        PRIVATE
    }
    
    enum UserStatus {
        WAITING
        READY
    }
`;

module.exports = typeDefs;
