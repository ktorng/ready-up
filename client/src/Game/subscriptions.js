import gql from 'graphql-tag';
import { merge, mergeWith } from 'lodash';
import { USER_DATA, GAME_DATA } from '../common/fragments';

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

const PLAYER_LEFT = gql`
    subscription playerLeft($gameId: ID!) {
        playerLeft(gameId: $gameId) {
            userId
            hostId
            isDeleted
        }
    }
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

const CREW_GAME_STARTED = gql`
    subscription crewGameStarted($gameId: ID!) {
        crewGameStarted(gameId: $gameId) {
            game {
                ...GameData
            }
        }
    }
    ${GAME_DATA}
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

export const playerLeft = (gameId, origUserId) => ({
    document: PLAYER_LEFT,
    variables: { gameId },
    updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data || subscriptionData.data.playerLeft.userId === origUserId) return prev;

        const { isDeleted, userId, hostId } = subscriptionData.data.playerLeft;

        if (isDeleted) {
            return { ...prev, game: null };
        }

        return {
            game: {
                ...prev.game,
                users: prev.game.users.filter((user) => user.id !== userId),
                hostId
            }
        }
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

        return merge({}, nextState);
    }
});

export const crewGameStarted = (gameId) => ({
    document: CREW_GAME_STARTED,
    variables: { gameId },
    updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const nextState = { ...prev, game: subscriptionData.data.crewGameStarted.game };

        return merge({}, nextState);
    }
});
