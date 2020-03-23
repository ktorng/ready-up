const colors = ['R', 'G', 'B', 'Y', 'W'];
const numbers = [...Array(9)].map((_, i) => i + 1);
const rockets = [...Array(4)].map((_, i) => i + 1);

module.exports = {
    /**
     * Generates a list of player objects which contain a list of cards and whether or not the
     * player is the commander
     *
     * @returns {{isCommander: boolean, hand: []}[]}
     */
    generatePlayers: () => {
        const players = [...Array(4)].map(() => ({ isCommander: false, hand: [] }));
        const cards = colors.reduce(
            (tot, color) => [
                ...tot,
                ...(color === 'W' ? rockets : numbers).map((number) => ({ color, number }))
            ],
            []
        );

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
    /**
     * Generates a list of task objects which contain card and optional order
     *
     * @param count - number of tasks
     * @param taskReqs - task requirements; object of counts for each requirement
     */
    generateMission: (count, taskReqs) => {
        const tasks = {
            unordered: [],
            ordered: [],
            first: null,
            last: null,
        };
        const cards = colors
            .filter((color) => color !== 'W')
            .reduce((tot, color) => [...tot, ...numbers.map((number) => ({ color, number }))], []);

        [...Array(count)].forEach(() => {
            // get random card
            const i = Math.floor(Math.random() * cards.length);
            const temp = cards[i];
            cards[i] = cards[cards.length - 1];
            cards[cards.length - 1] = temp;
            const card = cards.pop();

            // push to task type depending on task requirements
            if (taskReqs.first) {
                tasks.first = card;
                taskReqs.first = 0;
            } else if (taskReqs.last) {
                tasks.last = card;
                taskReqs.last = 0;
            } else if (taskReqs.ordered) {
                tasks.ordered.push(card);
            } else {
                tasks.unordered.push(card);
            }
        });

        return tasks;
    }
};
