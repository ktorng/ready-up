import { useMemo } from 'react';

/**
 * Builds ordered array of players
 * 0: current player
 * 1: player on left
 * 2: player on top
 * 3: player on right
 *
 * @param players - array of players in game
 * @param me - current user object
 */
export const usePlayers = (players, me) => {
    return useMemo(() => {
        const myPlayerIndex = players.findIndex(p => p.userId === me.id);

        return [...players.slice(myPlayerIndex), ...players.slice(0, myPlayerIndex)];
    }, [players, me.id]);
};
