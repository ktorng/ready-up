const { gql, PubSub, withFilter } = require('apollo-server');

const { generatePlayers, generateMission } = require('../../utils/crew');
const { matchGameId } = require('../../utils/game');

const pubsub = new PubSub();
const events = {
    CREW_GAME_STARTED: 'CREW_GAME_STARTED'
};
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
            gameState: String
        }

        extend type GameUpdateResponse {
            players: [Player]
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
        }

        extend type Subscription {
            crewGameStarted(gameId: ID!): CrewGameStartedPayload
        }

        type CrewGameStartedPayload {
            gameId: ID!
            game: Game!
            players: [Player]!
        }
    `,
    resolvers: {
        Mutation: {
            startCrewGame: async (_, { gameId }, { dataSources }) => {
                // TODO: move into util
                const mockTaskReqs = {
                    unordered: 3,
                    ordered: 2
                };
                // generate game state and player states
                const gameState = {
                    gameId,
                    played: [],
                    tasks: generateMission(5, mockTaskReqs),
                    turn: 0 // 0: mission assignment, -1: complete, 1+: player turns
                };
                const playerStates = generatePlayers();

                try {
                    let game = await dataSources.gameAPI.updateGame(
                        {
                            status: 'IN_PROGRESS',
                            gameState: JSON.stringify(gameState)
                        },
                        { id: gameId }
                    );
                    let players = await dataSources.gameAPI.getGameUsers({ gameId: game.id });
                    // update each player object in game
                    players = await Promise.all(
                        players.map((player, i) =>
                            dataSources.gameAPI.updateGameUser(
                                { playerState: JSON.stringify(playerStates[i]) },
                                { gameId, userId: player.userId }
                            )
                        )
                    );
                    game = game.dataValues;
                    players = players.map((player) => player.dataValues);

                    // emit event for other players
                    await pubsub.publish(events.CREW_GAME_STARTED, {
                        crewGameStarted: { gameId: game.id, game, players }
                    });

                    // return game state and player states
                    return {
                        success: true,
                        game,
                        players
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
                        matchGameId(payload.crewGameStarted.gameId, variables.gameId)
                )
            }
        },
    },
};
