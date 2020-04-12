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
    subscription playerLeft($gameId: ID!, $currentPlayerId: ID!) {
        playerLeft(gameId: $gameId, currentPlayerId: $currentPlayerId) {
            playerId
            hostId
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
    },
});

export const playerLeft = (gameId, currentPlayerId) => ({
    document: PLAYER_LEFT,
    variables: { gameId, currentPlayerId },
    updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const { playerId, hostId } = subscriptionData.data.playerLeft;

        const players = prev.game.players.reduce((next, player) => {
            if (hostId === player.id) {
                player.isHost = true;
            }
            if (player.id !== playerId) {
                next.push(player);
            }
            return next;
        }, []);

        return {
            game: {
                ...prev.game,
                players,
            },
        };
    },
});

export const playerUpdated = (gameId, currentPlayerId) => ({
    document: PLAYER_UPDATED,
    variables: { gameId, currentPlayerId },
    updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const { player: playerUpdated } = subscriptionData.data.playerUpdated;
        const nextState = { ...prev };
        nextState.game.players = nextState.game.players.map((player) =>
            player.id === playerUpdated.id ? playerUpdated : player
        );

        return merge({}, nextState);
    },
});

export const crewGameStarted = (gameId) => ({
    document: CREW_GAME_STARTED,
    variables: { gameId },
    updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const nextState = { ...prev, game: subscriptionData.data.crewGameStarted.game };

        return merge({}, nextState);
    },
});
