import React from 'react';
import T from 'prop-types';
import { get } from 'lodash';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/react-hooks';

import PlayerReady from './PlayerReady';
import usePlayerStyles from './usePlayerStyles';
import { USER_DATA } from '../common/schema';

const GET_USER = gql`
    query getUser($userId: ID!) {
        user(userId: $userId) @client {
            ...UserData
        }
    }
    ${USER_DATA}
`;

const UPDATE_USER = gql`
    mutation updateUser($userId: ID!, $gameId: ID!, $status: UserStatus, $statusMessage: String) {
        updateUser(userId: $userId, gameId: $gameId, status: $status, statusMessage: $statusMessage) {
            success,
            user {
                ...UserData
            }
        }
    }
    ${USER_DATA}
`;

const Player = ({ game, userId, current }) => {
    const classes = usePlayerStyles();
    const isCurrent = userId === get(current, 'id');
    const { data: { user } } = useQuery(GET_USER, { variables: { userId: userId }});
    const [updateUser] = useMutation(UPDATE_USER);

    return (
        <div className={classes.player}>
            <div className={classes.name} title={user.email}>
                {user.name}
            </div>
            <div className={classes.ready}>
                <PlayerReady
                    isCurrent={isCurrent}
                    game={game}
                    user={user}
                    updateUser={updateUser}
                />
            </div>
            <div className={classes.note}>
                {user.statusMessage}
            </div>
        </div>
    );
};

Player.propTypes = {
    game: T.object,
    user: T.object,
    current: T.object
};

export default Player;
