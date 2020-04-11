import React from 'react';
import T from 'prop-types';
import CheckBoxOutlineBlankRoundedIcon from '@material-ui/icons/CheckBoxOutlineBlankRounded';
import CheckBoxRoundedIcon from '@material-ui/icons/CheckBoxRounded';

const PlayerReady = ({ game, isCurrent, player, updatePlayer }) => {
    const ready = player.status === 'READY';

    const updateStatus = () => {
        const status = ready ? 'WAITING' : 'READY';
        updatePlayer({
            variables: {
                gameId: game.id,
                playerId: player.id,
                status,
            },
            // provide optimistic update for local cache
            optimisticResponse: {
                __typename: 'Mutation',
                updatePlayer: {
                    __typename: 'PlayerUpdateResponse',
                    success: true,
                    player: {
                        ...player,
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
    player: T.object.isRequired,
    updatePlayer: T.func.isRequired,
};

export default PlayerReady;
