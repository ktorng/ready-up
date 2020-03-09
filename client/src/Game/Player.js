import React, { useState } from 'react';
import { debounce, get } from 'lodash';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import CheckBoxOutlineBlankRoundedIcon from '@material-ui/icons/CheckBoxOutlineBlankRounded';
import CheckBoxRoundedIcon from '@material-ui/icons/CheckBoxRounded';

import { makeStyles } from '@material-ui/core/styles';

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

const UPDATE_USER = gql`
    mutation updateUser($userId: ID!, $status: UserStatus, $statusMessage: String) {
        updateUser(userId: $userId, status: $status, statusMessage: $statusMessage) {
            success
        }
    }
`;

const ReadyIcon = ({ isCurrent, user, updateUser }) => {
    const [ready, setReady] = useState(user.status === 'READY');

    const updateStatus = () => {
        setReady(!ready);
        updateUser({ variables: {
            userId: user.id,
            status: ready ? 'WAITING' : 'READY'
        }});
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

const Player = ({ user, current }) => {
    const classes = useStyles();
    const isCurrent = user.id === get(current, 'id');
    const [updateUser] = useMutation(UPDATE_USER);

    return (
        <div className={classes.player}>
            <div className={classes.name} title={user.email}>
                {user.name}
            </div>
            <div className={classes.ready}>
                <ReadyIcon
                    isCurrent={isCurrent}
                    user={user}
                    updateUser={debounce(updateUser, 300)}
                />
            </div>
            <div className={classes.note}>
                {user.statusMessage}
            </div>
        </div>
    );
};

export default Player;
