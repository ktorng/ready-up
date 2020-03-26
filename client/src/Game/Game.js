import React from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useParams } from '@reach/router';
import { get } from 'lodash';

import Lobby from './Lobby';
import * as gameSubscriptions from './subscriptions';
import Loading from '../common/Loading';
import { GAME_DATA, PLAYER_DATA } from '../common/schema';

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
            players {
                ...PlayerData
            }
        }
    }
    ${GAME_DATA}
    ${PLAYER_DATA}
`;

const Game = () => {
    const { accessCode } = useParams();
    const { data, loading, error, subscribeToMore } = useQuery(GET_GAME, {
        variables: { accessCode },
        fetchPolicy: 'network-only'
    });
    const [startCrewGame] = useMutation(START_CREW_GAME, {
        variables: { gameId: get(data, 'game.id') },
        onCompleted: ({ startCrewGame: { success, game, players } }) => {
            console.log(success, game, players);
        }
    });
    // subscribe to game updates
    const subscribe = (userId) => {
        subscribeToMore(gameSubscriptions.playerJoined(data.game.id));
        subscribeToMore(gameSubscriptions.playerLeft(data.game.id));
        subscribeToMore(gameSubscriptions.userUpdated(data.game.id, userId));
        subscribeToMore(gameSubscriptions.crewGameStarted(data.game.id));
    };

    if (loading) return <Loading />;
    if (error) return <p>ERROR</p>;
    if (!data) return <p>Not found</p>;

    return <Lobby game={data.game} subscribe={subscribe} startCrewGame={startCrewGame} />;
};

export default Game;
