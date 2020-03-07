import React, { useState } from 'react';
import { debounce, get } from 'lodash';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import CheckBoxOutlineBlankRoundedIcon from '@material-ui/icons/CheckBoxOutlineBlankRounded';
import CheckBoxRoundedIcon from '@material-ui/icons/CheckBoxRounded';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(_ => ({
    player: {
        width: '100%',
        display: 'flex',
        background: '#ececec',
        padding: 8,
    },
    name: {
        flex: '0 0 25%',
    },
    status: {
        flex: '0 0 15%',
        display: 'flex',
        alignItems: 'center',
    },
}));

const UPDATE_USER = gql`
    mutation updateUser($userId: ID!, $status: UserStatus, $statusMessage: String) {
        updateUser(userId: $userId, status: $status, statusMessage: $statusMessage) {
            success
        }
    }
`;

const ReadyIcon = ({ user }) => {
    const [ready, setReady] = useState(user.status === 'READY');
    const [updateUser] = useMutation(UPDATE_USER);

    const debouncedUpdateUser = debounce(updateUser, 300, { leading: true });

    const updateStatus = () => {
        setReady(!ready);
        debouncedUpdateUser({ variables: {
            userId: user.id,
            status: ready ? 'READY' : 'WAITING'
        }});
    };

    return (
        <div onClick={updateStatus}>
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
    console.log(current);

    return (
        <div className={classes.player}>
            <div className={classes.name} title={user.email}>
                {user.name}
            </div>
            <div className={classes.status}>
                {user.status}
                {isCurrent && <ReadyIcon user={user} />}
            </div>
            <div className={classes.statusMessage}>
                {user.statusMessage}
            </div>
        </div>
    );
};

export default Player;
