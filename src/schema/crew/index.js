const { gql, withFilter } = require('apollo-server');
const { get, isMatch } = require('lodash');

const { generatePlayers, generateMission, checkGameState } = require('../../utils/crew');
const { matchId } = require('../../utils/game');
const {
    store: { pubsub },
} = require('../../utils');

const events = {
    CREW_GAME_STARTED: 'CREW_GAME_STARTED',
    TASK_ASSIGNED: 'TASK_ASSIGNED',
    CARD_PLAYED: 'CARD_PLAYED',
};
// TODO: move into util that gets task requirements based on mission number
const mockTaskReqs = {
    UNORDERED: 3,
    ORDERED: 2,
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
            playerId: ID # player who played this card
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
            rounds: [[Card]]
            isLost: Boolean
        }

        type PlayerState {
            hand: [Card]!
            isCommander: Boolean!
            playerId: ID
            played: Card
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
            assignTask(gameId: ID!, card: CardInput!, isLast: Boolean!): GameUpdateResponse!
            playCard(gameId: ID!, card: CardInput!): GameUpdateResponse
        }

        extend type Subscription {
            crewGameStarted(gameId: ID!): CrewGameStartedPayload
            taskAssigned(gameId: ID!): GameStateUpdatedPayload
            cardPlayed(gameId: ID!): GameStateUpdatedPayload
        }

        type CrewGameStartedPayload {
            gameId: ID!
            game: Game!
        }

        type GameStateUpdatedPayload {
            gameId: ID!
            gameState: GameState!
        }
    `,
    resolvers: {
        Mutation: {
            startCrewGame: async (_, { gameId }, { dataSources }) => {
                try {
                    const players = await dataSources.userAPI.getPlayers({ gameId });
                    const playerStates = generatePlayers(players.map((p) => p.id));
                    const commanderPlayerId = get(
                        playerStates.find((p) => p.isCommander),
                        'playerId'
                    );
                    const tasks = generateMission(5, mockTaskReqs);
                    // generate game state
                    const gameState = {
                        tasks,
                        playerStates,
                        turn: 0, // 0: mission assignment, -1: complete, 1+: player turns
                        turnPlayerId: commanderPlayerId,
                        isLost: false
                    };
                    const game = await dataSources.gameAPI.updateGame(
                        {
                            status: 'IN_PROGRESS',
                            gameState: JSON.stringify(gameState),
                        },
                        { id: gameId }
                    );

                    await pubsub.publish(events.CREW_GAME_STARTED, {
                        crewGameStarted: { gameId, game },
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
            },
            assignTask: async (_, { gameId, card, isLast }, { dataSources }) => {
                const { playerId } = card;

                try {
                    let game = await dataSources.gameAPI.getGame({ id: gameId });
                    const players = await dataSources.userAPI.getPlayers({ gameId });
                    const gameState = JSON.parse(game.gameState);
                    // update tasks
                    gameState.tasks = gameState.tasks.map((task) => {
                        if (isMatch(card, task.card)) {
                            return { ...task, playerId: playerId };
                        }
                        return task;
                    });
                    // if last task, start actual game turn and set turn player to commander
                    if (isLast) {
                        const commanderIndex = gameState.playerStates.findIndex(p => p.isCommander);
                        gameState.turnPlayerId = players[commanderIndex].id;
                        gameState.turn = 1;
                    } else {
                        const playerIndex = players.findIndex(p => matchId(p.id, playerId));
                        gameState.turnPlayerId = players[(playerIndex + 1) % players.length].id;
                    }

                    game = await dataSources.gameAPI.updateGame(
                        { gameState: JSON.stringify(gameState) },
                        { id: gameId }
                    );

                    // emit event
                    await pubsub.publish(events.TASK_ASSIGNED, {
                        taskAssigned: { gameId, gameState },
                    });

                    return {
                        success: true,
                        game,
                    };
                } catch (e) {
                    console.error(e);
                    return { success: false };
                }
            },
            playCard: async (_, { gameId, card }, { dataSources }) => {
                try {
                    let game = await dataSources.gameAPI.getGame({ id: gameId });
                    const players = await dataSources.userAPI.getPlayers({ gameId });
                    const playerIndex = players.findIndex(p => p.id = card.playerId);
                    const gameState = JSON.parse(game.gameState);
                    const { rounds } = gameState;

                    rounds[rounds.length - 1].push(card);
                    gameState.playerStates[playerIndex].played = card;

                    // if last card of round, check round winner
                    if (rounds[rounds.length - 1] === players.length) {
                        const { isLost, isWon, tasks } = checkGameState(game.gameState.played);

                        gameState.tasks = tasks;

                        if (isLost || isWon) {
                            gameState.turn = -1;
                            gameState.isLost = isLost;
                        }

                        // reset player played
                        gameState.playerStates = gameState.playerStates.map((ps => ({
                            ...ps,
                            played: null
                        })));
                    }

                    game = await dataSources.gameAPI.updateGame(
                        { gameState: JSON.stringify(gameState) },
                        { id: gameId }
                    );
                    // TODO: delete
                    console.log(gameState);

                    // emit event
                    await pubsub.publish(events.CARD_PLAYED, {
                        cardPlayed: { gameId, gameState },
                    });

                    return {
                        success: true,
                        game,
                    };
                } catch (e) {
                    console.error(e);
                    return { success: false };
                }
            },
        },
        Subscription: {
            crewGameStarted: {
                subscribe: withFilter(
                    () => pubsub.asyncIterator(events.CREW_GAME_STARTED),
                    (payload, variables) =>
                        matchId(payload.crewGameStarted.gameId, variables.gameId)
                ),
            },
            taskAssigned: {
                subscribe: withFilter(
                    () => pubsub.asyncIterator(events.TASK_ASSIGNED),
                    (payload, variables) => matchId(payload.taskAssigned.gameId, variables.gameId)
                ),
            },
            cardPlayed: {
                subscribe: withFilter(
                    () => pubsub.asyncIterator(events.CARD_PLAYED),
                    (payload, variables) => matchId(payload.cardPlayed.gameId, variables.gameId)
                ),
            },
        },
    },
};
