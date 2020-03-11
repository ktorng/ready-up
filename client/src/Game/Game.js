import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useParams } from '@reach/router';

import Lobby from './Lobby';
import { playerJoined, userUpdated } from './subscriptions';
import Loading from '../common/Loading';
import { GAME_DATA } from '../common/schema';

export const GET_GAME = gql`
    query getGame($accessCode: String!) {
        game(accessCode: $accessCode) {
            ...GameData
        }
    }
    ${GAME_DATA}
`;

const Game = () => {
    const { accessCode } = useParams();
    const { data, loading, error, subscribeToMore } = useQuery(GET_GAME, {
        variables: { accessCode },
        fetchPolicy: 'network-only'
    });
    const subscribe = (userId) => {
        subscribeToMore(playerJoined(data.game.id));
        subscribeToMore(userUpdated(data.game.id, userId));
    };

    if (loading) return <Loading />;
    if (error) return <p>ERROR</p>;
    if (!data) return <p>Not found</p>;

    return <Lobby game={data.game} subscribe={subscribe} />;
};

export default Game;
