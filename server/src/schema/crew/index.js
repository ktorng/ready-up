const { gql } = require('apollo-server');

const { generatePlayers, generateMission } = require('../utils/crew');

// TODO: split into separate schema files
module.exports = {
    schema: gql`
        type Task {
            id: ID!
            card: Card
            order: Int
            playerId: ID
            isCompleted: Boolean!
            type: TaskType # for special mission types
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
        
        extend type Game {
            gameState: GameState
        }
        
        type GameState {
            gameId: ID!
            played: [Card]
            turn: Int!
            players: [PlayerState!]!
        }
        
        type PlayerState {
            userId: ID!
            hand: [Card]!
            isCommander: Boolean!
        }

        enum TaskType {
            ORDERED
            UNORDERED
            FIRST
            LAST
            SPECIAL
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
        Mutation: {
            startCrewGame: async (_, { gameId }, { dataSources }) => {
                // generate game state and player states
                const gameState = {
                    gameId,
                    played: [],
                    turn: 0 // 0: mission assignment, -1: complete, 1+: player turns
                };
                const playerStates = generatePlayers();
                // update game object
                const game = await dataSources.gameAPI.updateGame(
                    { gameState: JSON.stringify(gameState) },
                    { id: gameId }
                );
                const players = await dataSources.gameAPI.getGameUsers({ gameId: game.id });
                // update each player object in game
                await Promise.all(
                    players.map((player, i) =>
                        dataSources.gameAPI.updateGameUser(
                            { playerState: playerStates[i] },
                            { gameId, userId: player.userId }
                        )
                    )
                );

                // return game state and player states
            }
        }
    }
};
