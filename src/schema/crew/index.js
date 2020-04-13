const { gql, withFilter } = require('apollo-server');
const { get } = require('lodash');

const { generatePlayers, generateMission } = require('../../utils/crew');
const { matchId } = require('../../utils/game');
const { store: { pubsub } } = require('../../utils');

const events = {
    CREW_GAME_STARTED: 'CREW_GAME_STARTED'
};
// TODO: move into util that gets task requirements based on mission number
const mockTaskReqs = {
    UNORDERED: 3,
    ORDERED: 2
};

// TODO: split into separate schema files
module.exports = {
    schema: gql`
        type Task {
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
        }
        
        input CardInput {
            number: Int!
            color: String
            playerId: ID!
        }
        
        type GameState {
            tasks: [Task]
            playerStates: [PlayerState]
            turn: Int
            turnPlayerId: ID
        }
        
        type PlayerState {
            hand: [Card]!
            isCommander: Boolean!
            playerId: ID
        }
        
        extend type Game {
            gameState: GameState
        }

        enum TaskType {
            ORDERED
            UNORDERED
            FIRST
            LAST
            SPECIAL
        }

        extend enum GameType {
            THE_CREW
        }

        extend type Mutation {
            startCrewGame(gameId: ID!): GameUpdateResponse!
            assignTask(gameId: ID!, card: CardInput!): GameUpdateResponse!
        }

        extend type Subscription {
            crewGameStarted(gameId: ID!): CrewGameStartedPayload
        }

        type CrewGameStartedPayload {
            gameId: ID!
            game: Game!
        }
    `,
    resolvers: {
        Mutation: {
            startCrewGame: async (_, { gameId }, { dataSources }) => {
                const players = await dataSources.userAPI.getPlayers({ gameId });
                const playerStates = generatePlayers(players.map(p => p.id));
                const commanderPlayerId = get(playerStates.find(p => p.isCommander), 'playerId');
                const tasks = generateMission(5, mockTaskReqs);
                // generate game state
                const gameState = {
                    tasks,
                    playerStates,
                    turn: 0, // 0: mission assignment, -1: complete, 1+: player turns
                    turnPlayerId: commanderPlayerId,
                };

                try {
                    const game = await dataSources.gameAPI.updateGame(
                        {
                            status: 'IN_PROGRESS',
                            gameState: JSON.stringify(gameState)
                        },
                        { id: gameId }
                    );

                    await pubsub.publish(events.CREW_GAME_STARTED, {
                        crewGameStarted: { gameId, game }
                    });

                    // return game state and player states
                    return {
                        success: true,
                        game,
                    };
                } catch (e) {
                    console.error(e);
                    return { success: false };
                }
            }
        },
        Subscription: {
            crewGameStarted: {
                subscribe: withFilter(
                    () => pubsub.asyncIterator(events.CREW_GAME_STARTED),
                    (payload, variables) =>
                        matchId(payload.crewGameStarted.gameId, variables.gameId)
                )
            }
        },
    },
};
