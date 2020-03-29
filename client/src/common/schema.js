import gql from 'graphql-tag';

export const USER_DATA = gql`
    fragment UserData on User {
        id
        email
        name
        status
        statusMessage
        playerState
    }
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
        users {
            ...UserData
        }
    }
    ${USER_DATA}
`;
