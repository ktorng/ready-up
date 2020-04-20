import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useParams } from '@reach/router';
import { get } from 'lodash';

import Lobby from './Lobby';
import { Layout } from './Crew';
import * as gameSubscriptions from './subscriptions';
import { GameContext, MeContext } from '../common/utils';
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
    const [playerIdDebug, setPlayerIdDebug] = useState(null);
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

    if (loading) return <Loading />;
    if (error) return <p>ERROR</p>;
    if (!gameData) return <p>Not found</p>;

    // subscribe to game updates
    const { game } = gameData;
    const subscribe = (playerId) => {
        subscribeToMore(gameSubscriptions.playerJoined(game.id));
        subscribeToMore(gameSubscriptions.playerLeft(game.id, playerId));
        subscribeToMore(gameSubscriptions.playerUpdated(game.id, playerId));
        subscribeToMore(gameSubscriptions.crewGameStarted(game.id));
        subscribeToMore(gameSubscriptions.taskAssigned(game.id));
        subscribeToMore(gameSubscriptions.cardPlayed(game.id));
    };
    const player = game.players.find((p) => p.userId === me.id);

    const setPlayerId = (playerId) => setPlayerIdDebug(playerId);

    return (
        <MeContext.Provider value={{ ...me, playerId: playerIdDebug || player.id, setPlayerId }}>
            <GameContext.Provider value={game}>
                {game.status === 'IN_PROGRESS' ? (
                    <Layout me={me} subscribe={subscribe} />
                ) : (
                    <Lobby
                        me={me}
                        subscribe={subscribe}
                        startCrewGame={startCrewGame}
                    />

                )}
            </GameContext.Provider>
        </MeContext.Provider>
    );
};

export default Game;
