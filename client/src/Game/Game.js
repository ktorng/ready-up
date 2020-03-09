import React, { useEffect } from 'react';
import { mergeWith } from 'lodash';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useParams } from '@reach/router';

import Lobby from './Lobby';
import Loading from '../common/Loading';
import { GAME_DATA, USER_DATA } from '../common/schema';

const GET_GAME = gql`
    query getGame($accessCode: String!) {
        game(accessCode: $accessCode) {
            ...GameData
        }
    }
    ${GAME_DATA}
`;

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

const Game = () => {
    const { accessCode } = useParams();
    const { data, loading, error, subscribeToMore } = useQuery(GET_GAME, {
        variables: { accessCode },
        fetchPolicy: 'network-only',
    });

    useEffect(() => {
        if (data) {
            // subscribe to new users joining the game
            subscribeToMore({
                document: PLAYER_JOINED,
                variables: { gameId: data.game.id },
                updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data || !subscriptionData.data.playerJoined.isNew) return prev;

                    return mergeWith(
                        {},
                        prev,
                        { game: { users: [subscriptionData.data.playerJoined.user] } },
                        (dst, src) => Array.isArray(dst) ? [...dst, ...src] : undefined
                    );
                },
            })
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
