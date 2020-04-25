import { isRocket, matchesColor } from '../utils';
import { useMeContext, useGameContext } from '../../../common/utils';

/**
 * Determines which cards in hand are currently playable and returns sorted hand
 *
 * @param {Array} hand
 */
export const useHand = (hand) => {
    const me = useMeContext();
    const game = useGameContext();
    const { turnPlayerId, rounds } = game.gameState;
    const isCurrentTurn = turnPlayerId === me.playerId;

    // not current player's turn, just return sorted hand
    if (!isCurrentTurn) {
        return sortHand(hand);
    }

    // get card that lead this round
    const leadCard = rounds[rounds.length - 1].cards.find((card) => card.isLead);
    let res;
    const hasOnlyRocket = hand.every(isRocket);

    if (hasOnlyRocket) {
        // any card is playable since only rockets are left
        res = hand.map((card) => ({ ...card, isPlayable: true }));
    } else {
        if (!leadCard) {
            // any card is playable as long as not a rocket
            res = hand.map((card) => (isRocket(card) ? card : { ...card, isPlayable: true }));
        } else {
            // cards that match color can be played, unless none
            const hasMatchingColor = hand.some((card) => matchesColor(card, leadCard));

            if (!hasMatchingColor) {
                res = hand.map((card) => ({ ...card, isPlayable: true }));
            } else {
                res = hand.map((card) =>
                    !matchesColor(card, leadCard) ? card : { ...card, isPlayable: true }
                );
            }
        }
    }

    return sortHand(res);
};

function sortHand(hand) {
    const colors = {};

    for (let card of hand) {
        if (!colors[card.color]) {
            colors[card.color] = [];
        }
        colors[card.color].push(card);
    }

    Object.keys(colors).forEach((color) => {
        colors[color].sort((a, b) => a.number - b.number);
    });

    return ['R', 'G', 'B', 'Y', 'W'].reduce((res, color) => {
        if (colors[color]) {
            res = res.concat(colors[color]);
        }
        return res;
    }, []);
}
