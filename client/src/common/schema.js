import { gql } from 'apollo-boost';

export const USER_DATA = gql`
    fragment UserData on User {
        id
        email
        status
        statusMessage
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
        users {
            ...UserData
        }
    }
    ${USER_DATA}
`;
