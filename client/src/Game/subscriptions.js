import gql from 'graphql-tag';
import { merge, mergeWith } from 'lodash';
import { PLAYER_DATA, GAME_DATA } from '../common/fragments';

const PLAYER_JOINED = gql`
    subscription playerJoined($gameId: ID!) {
        playerJoined(gameId: $gameId) {
            player {
                ...PlayerData
            }
            isNew
        }
    }
    ${PLAYER_DATA}
`;

const PLAYER_LEFT = gql`
    subscription playerLeft($gameId: ID!) {
        playerLeft(gameId: $gameId) {
            playerId
            hostId
            isDeleted
        }
    }
`;

const PLAYER_UPDATED = gql`
    subscription playerUpdated($gameId: ID!, $currentPlayerId: ID!) {
        playerUpdated(gameId: $gameId, currentPlayerId: $currentPlayerId) {
            player {
                ...PlayerData
            }
        }
    }
    ${PLAYER_DATA}
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
            { game: { players: [subscriptionData.data.playerJoined.player] } },
            (dst, src) => (Array.isArray(dst) ? [...dst, ...src] : undefined)
        );
    }
});

export const playerLeft = (gameId, currentPlayerId) => ({
    document: PLAYER_LEFT,
    variables: { gameId },
    updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data || subscriptionData.data.playerLeft.playerId === currentPlayerId) return prev;

        const { isDeleted, playerId, hostId } = subscriptionData.data.playerLeft;

        if (isDeleted) {
            return { ...prev, game: null };
        }

        return {
            game: {
                ...prev.game,
                users: prev.game.players.filter((player) => player.id !== playerId),
                hostId
            }
        }
    }
});

export const playerUpdated = (gameId, playerId) => ({
    document: PLAYER_UPDATED,
    variables: { gameId, currentPlayerId: playerId },
    updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const { player: playerUpdated } = subscriptionData.data.playerUpdated;
        const nextState = { ...prev };
        nextState.game.players = nextState.game.players.map((player) =>
            player.id === playerUpdated.id ? playerUpdated : player
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
