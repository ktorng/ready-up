import gql from 'graphql-tag';

export const PLAYER_DATA = gql`
    fragment PlayerData on Player {
        id
        userId
        gameId
        status
        statusMessage
        isHost
        email
        name
    }
`;

export const GAME_STATE_DATA = gql`
    fragment GameStateData on GameState {
        tasks {
            card {
                color
                number
            }
            playerId
            type
            order
            isCompleted
        }
        playerStates {
            hand {
                color
                number
            }
            isCommander
            playerId
            played {
                color
                number
            }
        }
        rounds {
            cards {
                color
                number
                playerId
            }
            winnerId
        }
        turn
        turnPlayerId
        isLost
    }
`;

export const USER_DATA = gql`
    fragment UserData on User {
        id
        email
        name
        players {
            ...PlayerData
        }
    }
    ${PLAYER_DATA}
`;

export const GAME_DATA = gql`
    fragment GameData on Game {
        id
        accessCode
        status
        name
        description
        size
        gameState {
            ...GameStateData
        }
        players {
            ...PlayerData
        }
    }
    ${PLAYER_DATA}
    ${GAME_STATE_DATA}
`;
