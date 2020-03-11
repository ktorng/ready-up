import React from 'react';
import T from 'prop-types';
import CheckBoxOutlineBlankRoundedIcon from '@material-ui/icons/CheckBoxOutlineBlankRounded';
import CheckBoxRoundedIcon from '@material-ui/icons/CheckBoxRounded';

const PlayerReady = ({ game, isCurrent, user, updateUser }) => {
    const ready = user.status === 'READY';

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

PlayerReady.propTypes = {
    game: T.object.isRequired,
    isCurrent: T.bool.isRequired,
    user: T.object.isRequired,
    updateUser: T.func.isRequired,
};

export default PlayerReady;
