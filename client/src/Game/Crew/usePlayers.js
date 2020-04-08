import { useMemo } from 'react';

/**
 * Builds ordered array of players
 * 0: current player
 * 1: player on left
 * 2: player on top
 * 3: player on right
 *
 * @param users - array of users in game
 * @param me - current user object
 */
export const usePlayers = (users, me) => {
    return useMemo(() => {
        const myPlayerIndex = users.findIndex(user => user.id === me.id);

        return [...users.slice(myPlayerIndex), ...users.slice(0, myPlayerIndex)];
    }, [users, me.id]);
};
