import React from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useParams } from '@reach/router';
import { get } from 'lodash';

import Lobby from './Lobby';
import { Layout } from './Crew';
import * as gameSubscriptions from './subscriptions';
import Loading from '../common/Loading';
import { GAME_DATA, USER_DATA } from '../common/fragments';

const GET_CURRENT_USER = gql`
    query me {
        me @client {
            ...UserData
        }
    }
    ${USER_DATA}
`;

export const GET_GAME = gql`
    query getGame($accessCode: String!) {
        game(accessCode: $accessCode) {
            ...GameData
        }
    }
    ${GAME_DATA}
`;

const START_CREW_GAME = gql`
    mutation startCrewGame($gameId: ID!) {
        startCrewGame(gameId: $gameId) {
            success
            game {
                ...GameData
            }
        }
    }
    ${GAME_DATA}
`;

const Game = () => {
    const { accessCode } = useParams();
    const { data: gameData, loading, error, subscribeToMore } = useQuery(GET_GAME, {
        variables: { accessCode },
        fetchPolicy: 'network-only',
    });
    const {
        data: { me },
    } = useQuery(GET_CURRENT_USER);
    const [startCrewGame] = useMutation(START_CREW_GAME, {
        variables: { gameId: get(gameData, 'game.id') },
    });

    // subscribe to game updates
    const subscribe = (playerId) => {
        subscribeToMore(gameSubscriptions.playerJoined(gameData.game.id));
        subscribeToMore(gameSubscriptions.playerLeft(gameData.game.id, playerId));
        subscribeToMore(gameSubscriptions.playerUpdated(gameData.game.id, playerId));
        subscribeToMore(gameSubscriptions.crewGameStarted(gameData.game.id));
    };

    if (loading) return <Loading />;
    if (error) return <p>ERROR</p>;
    if (!gameData) return <p>Not found</p>;

    const player = gameData.game.players.find((p) => p.userId === me.id);

    if (gameData.game.status === 'IN_PROGRESS')
        return <Layout me={me} player={player} game={gameData.game} />;

    return (
        <Lobby
            me={me}
            player={player}
            game={gameData.game}
            subscribe={subscribe}
            startCrewGame={startCrewGame}
        />
    );
};

export default Game;
