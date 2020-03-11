import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useParams } from '@reach/router';

import Lobby from './Lobby';
import { playerJoined } from './subscriptions';
import Loading from '../common/Loading';
import { GAME_DATA } from '../common/schema';

const GET_GAME = gql`
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
        fetchPolicy: 'network-only',
    });

    /**
     * Add subscriptions for players joining, user updates, game updates
     */
    useEffect(() => {
        if (data) {
            subscribeToMore(playerJoined(data));
        }
    }, [subscribeToMore, data]);

    if (loading) return <Loading />;
    if (error) return <p>ERROR</p>;
    if (!data) return <p>Not found</p>;

    return (
        <Lobby game={data.game} />
    );
};

export default Game;
