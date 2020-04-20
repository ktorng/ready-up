import { useMemo } from 'react';
import { merge } from 'lodash';

/**
 * Builds ordered array of players
 * 0: current player
 * 1: player on left
 * 2: player on top
 * 3: player on right
 *
 * @param game - game object
 * @param me - current user object
 */
export const usePlayers = (game, me) => {
    return useMemo(() => {
        const { players, gameState: { playerStates } } = game;
        const myPlayerIndex = players.findIndex(p => p.id === me.playerId);

        return merge(
            [],
            [...players.slice(myPlayerIndex), ...players.slice(0, myPlayerIndex)],
            [...playerStates.slice(myPlayerIndex), ...playerStates.slice(0, myPlayerIndex)]
        );
    }, [game, me.playerId]);
};
