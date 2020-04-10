import gql from 'graphql-tag';

export const PLAYER_DATA = gql`
    fragment PlayerData on Player {
        id
        userId
        gameId
        status
        statusMessage
        playerState
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
        hostId
        accessCode
        status
        name
        description
        size
        gameState
        players {
            ...PlayerData
        }
    }
    ${PLAYER_DATA}
`;
