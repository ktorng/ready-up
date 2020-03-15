const { gql } = require('apollo-server');

// TODO: split into separate schema files
module.exports = {
    schema: gql`
        type Task {
            id: ID!
            order: Int
            card: Card
            playerId: ID
            isCompleted: Boolean!
            type: String # for special mission types
        }
        
        type Player {
            id: ID!
            userId: ID!
            gameId: ID!
            hand: [Card]!
            isCommander: Boolean!
        }
        
        type Mission {
            number: Int!
            tasks: [Task]
        }
        
        type Card {
            number: Int!
            color: String # ['R', 'G', 'B', 'Y', 'W']
            isRocket: Boolean!
            order: Int
        }
        
        type GameState {
            gameId: ID!
            played: [Card]
            status: String!
        }
        
        extend type Query {
        }
        
        extend type Mutation {
        }
        
        extend enum GameType {
            THE_CREW
        }
    `,
    resolvers: {
    },
};
