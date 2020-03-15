module.exports = {
    /**
     * Generates a list of player objects which contain a list of cards and whether or not the
     * player is the commander
     *
     * @returns {{isCommander: boolean, hand: []}[]}
     */
    generateGame: () => {
        const colors = ['R', 'G', 'B', 'Y', 'W'];
        const numbers = [...Array(9)].map((_, i) => i + 1);
        const rockets = [...Array(4)].map((_, i) => i + 1);
        const players = [...Array(4)].map(() => ({ isCommander: false, hand: [] }));
        const cards = colors.reduce((tot, color) => [
            ...tot,
            ...(color === 'W' ? rockets : numbers).map(number => ({ color, number }))
        ], []);

        while (cards.length) {
            // random index and player index
            const i = Math.floor(Math.random() * cards.length);
            const j = cards.length % 4;

            // swap to end
            const temp = cards[i];
            cards[i] = cards[cards.length - 1];
            cards[cards.length - 1] = temp;

            // pass to player
            const card = cards.pop();
            players[j].hand.push(card);
            if (card.number === 4 && card.color === 'W') {
                players[j].isCommander = true;
            }
        }

        return players;
    },
};
