import React from 'react';
import T from 'prop-types';
import { get } from 'lodash';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/react-hooks';
import CheckBoxOutlineBlankRoundedIcon from '@material-ui/icons/CheckBoxOutlineBlankRounded';
import CheckBoxRoundedIcon from '@material-ui/icons/CheckBoxRounded';
import { makeStyles } from '@material-ui/core/styles';

import { USER_DATA } from '../common/schema';

export const useStyles = makeStyles(_ => ({
    player: {
        width: '100%',
        display: 'flex',
        background: '#ececec',
        padding: 8,
        marginBottom: 8,
        fontSize: 14,
        alignItems: 'center',
    },
    header: {
        fontSize: 10,
        fontWeight: 600,
        lineHeight: 0.5,
    },
    empty: {
        justifyContent: 'center',
        fontSize: 12,
    },
    name: {
        flex: '0 0 25%',
    },
    ready: {
        flex: '0 0 15%',
        display: 'flex',
        alignItems: 'center',
    },
    note: {
        flex: '0 0 50%',
    },
}));

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

const ReadyIcon = ({ game, isCurrent, user, updateUser }) => {
    const ready = user.status === 'READY';
    console.log(ready);

    const updateStatus = () => {
        const status = ready ? 'WAITING' : 'READY';
        updateUser({
            variables: {
                gameId: game.id,
                userId: user.id,
                status,
            },
            // provide optimistic update for local cache
            optimisticResponse: {
                __typename: 'Mutation',
                updateUser: {
                    __typename: 'UserUpdateResponse',
                    success: true,
                    user: {
                        ...user,
                        status,
                    },
                },
            }
        });
    };

    return (
        <div {...(isCurrent && { onClick: updateStatus })}>
            {ready ? (
                <CheckBoxRoundedIcon />
            ) : (
                <CheckBoxOutlineBlankRoundedIcon />
            )}
        </div>
    )
};

const Player = ({ game, userId, current }) => {
    const classes = useStyles();
    const isCurrent = userId === get(current, 'id');
    const { data: { user } } = useQuery(GET_USER, { variables: { userId: userId }});
    const [updateUser] = useMutation(UPDATE_USER);

    return (
        <div className={classes.player}>
            <div className={classes.name} title={user.email}>
                {user.name}
            </div>
            <div className={classes.ready}>
                <ReadyIcon
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
