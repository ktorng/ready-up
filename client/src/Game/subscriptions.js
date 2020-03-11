import gql from 'graphql-tag';
import { mergeWith } from 'lodash';
import { USER_DATA } from '../common/schema';

const PLAYER_JOINED = gql`
    subscription playerJoined($gameId: ID!) {
        playerJoined(gameId: $gameId) {
            user {
                ...UserData
            }
            isNew
        }
    }
    ${USER_DATA}
`;

const USER_UPDATED = gql`
    subscription userUpdated($gameId: ID!, $currentUserId: ID!) {
        userUpdated(gameId: $gameId, currentUserId: $currentUserId) {
            user {
                ...UserData
            }
        }
    }
    ${USER_DATA}
`;

export const playerJoined = (gameId) => ({
    document: PLAYER_JOINED,
    variables: { gameId },
    updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data || !subscriptionData.data.playerJoined.isNew) return prev;

        return mergeWith(
            {},
            prev,
            { game: { users: [subscriptionData.data.playerJoined.user] } },
            (dst, src) => (Array.isArray(dst) ? [...dst, ...src] : undefined)
        );
    }
});

export const userUpdated = (gameId, userId) => ({
    document: USER_UPDATED,
    variables: { gameId, currentUserId: userId },
    updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const { user: userUpdated } = subscriptionData.data.userUpdated;
        const nextState = { ...prev };
        nextState.game.users = nextState.game.users.map((user) =>
            user.id === userUpdated.id ? userUpdated : user
        );

        return mergeWith({}, nextState);
    }
});
