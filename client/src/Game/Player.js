import React from 'react';
import T from 'prop-types';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import PlayerReady from './PlayerReady';
import usePlayerStyles from './usePlayerStyles';
import { PLAYER_DATA } from '../common/fragments';

const UPDATE_PLAYER = gql`
    mutation updatePlayer($playerId: ID!, $gameId: ID!, $status: PlayerStatus, $statusMessage: String) {
        updatePlayer(playerId: $playerId, gameId: $gameId, status: $status, statusMessage: $statusMessage) {
            success,
            player {
                ...PlayerData
            }
        }
    }
    ${PLAYER_DATA}
`;

const Player = ({ game, player, isCurrent }) => {
    const classes = usePlayerStyles();
    const [updatePlayer] = useMutation(UPDATE_PLAYER);

    return (
        <div className={classes.player}>
            <div className={classes.name} title={player.email}>
                {player.name}
            </div>
            <div className={classes.ready}>
                <PlayerReady
                    isCurrent={isCurrent}
                    game={game}
                    player={player}
                    updatePlayer={updatePlayer}
                />
            </div>
            <div className={classes.note}>
                {player.statusMessage}
            </div>
        </div>
    );
};

Player.propTypes = {
    game: T.object,
    player: T.object,
    isCurrent: T.bool
};

export default Player;
