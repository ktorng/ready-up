const { gql, PubSub, withFilter } = require('apollo-server');
const { isEmpty } = require('lodash');

const pubsub = new PubSub();
const PLAYER_JOINED = 'PLAYER_JOINED';

const schema = gql`
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

    extend type Query {
        games: [Game]!
        game(accessCode: String!): Game
    }

    extend type Mutation {
        createGame(size: Int!, description: String!, name: String!): GameUpdateResponse!
        joinGame(accessCode: String!): GameUpdateResponse!
        updateGame(gameId: ID!, status: GameStatus): GameUpdateResponse!
        deleteGame(gameId: ID!): GameUpdateResponse!
    }
    
    extend type Subscription {
        playerJoined(gameId: ID!): Player
    }
    
    type Player {
        gameId: ID!
        user: User!
        isNew: Boolean!
    }

    type GameUpdateResponse {
        success: Boolean!
        message: String
        game: Game
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
`;

const resolvers = {
    Game: {
        // get users in a game using the root object's id (game id)
        users: async ({ id }, _, { dataSources }) => {
            const gameUsers = await dataSources.gameAPI.getGameUsers({ gameId: id });

            return dataSources.userAPI.getUsers(gameUsers.map(gameUser => gameUser.userId));
        }
    },
    Query: {
        games: (_, __, { dataSources }) =>
            dataSources.gameAPI.getGames(),
        game: (_, { accessCode }, { dataSources }) =>
            dataSources.gameAPI.getGame({ accessCode }),
    },
    Mutation: {
        createGame: async (_, { name, size, description }, { dataSources }) => {
            const game = await dataSources.gameAPI.createGame({ size, name, description });

            return {
                success: !!game,
                message: game ? 'Successfully created game' : `Failed to create game: ${name} (${size})`,
                game
            };
        },
        joinGame: async (_, { accessCode }, { dataSources, user }) => {
            const game = await dataSources.gameAPI.getGame({ accessCode });

            // did not find game
            if (isEmpty(game)) {
                return {
                    success: false,
                    message: `Failed to find game with access code: ${accessCode}`,
                    game: null
                };
            }

            const gameUsers = await dataSources.gameAPI.getGameUsers({ gameId: game.id });
            const isNew = gameUsers.findIndex(gu => gu.userId === user.id) === -1;

            // if full and user is not currently in this game
            if (gameUsers.length === game.size && isNew) {
                return {
                    success: false,
                    message: `Failed to join game with accessCode: ${accessCode}. Game is currently full.`,
                    game: null
                };
            }

            await dataSources.gameAPI.joinGame({ gameId: game.id });
            await pubsub.publish(PLAYER_JOINED, { playerJoined: { gameId: game.id, user, isNew } });

            return {
                success: true,
                message: 'Successfully joined game',
                game
            };
        },
        updateGame: async (_, { gameId, status }, { dataSources }) => {
            const game = await dataSources.gameAPI.updateGame(
                { status },
                { id: gameId }
            );

            return {
                success: !!game,
                game
            };
        },
        deleteGame: async (_, { gameId }, { dataSources }) => {
            // delete gameUsers first, then delete the game
            await dataSources.gameAPI.deleteGameUsers({ gameId });
            const deletedGame = await dataSources.gameAPI.deleteGame({ id: gameId });

            // TODO: handle partial failure
            return {
                success: deletedGame
            };
        },
    },
    Subscription: {
        playerJoined: {
            // subscribe only to matching game id
            subscribe: withFilter(
                () => pubsub.asyncIterator(PLAYER_JOINED),
                (payload, variables) => payload.playerJoined.gameId === parseInt(variables.gameId, 10)
            )
        }
    }
};

module.exports = {
    schema,
    resolvers
};
