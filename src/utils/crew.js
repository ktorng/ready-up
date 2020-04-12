const { COLORS, ROCKETS, NUMBERS, TASK_TYPES } = require('./constants');

module.exports = {
    /**
     * Generates a list of player objects which contain a list of cards and whether or not the
     * player is the commander
     *
     * @param playerIds {string[]}
     * @returns {{}[]} list of player hands
     */
    generatePlayers: (playerIds) => {
        const players = [...Array(4)].map(() => ({ isCommander: false, hand: [] }));
        const cards = COLORS.reduce(
            (tot, color) => [
                ...tot,
                ...(color === 'W' ? ROCKETS : NUMBERS).map((number) => ({ color, number })),
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

        // return list of hands with playerId attached
        return playerIds.map((id, i) => ({ ...players[i], playerId: id }));
    },
    /**
     * Generates a list of task objects which contain card and optional order
     *
     * @param count {number} - number of tasks
     * @param taskReqs {Object} - task requirements; object of counts for each requirement
     * @returns {{}[]} dict of player id or "unassigned" to list of tasks
     */
    generateMission: (count, taskReqs) => {
        const orderIndex = taskReqs[TASK_TYPES.ORDERED];
        const buildTask = (card, type, order) => ({
            card,
            type,
            order,
        });
        const tasks = [];
        const cards = COLORS.filter((color) => color !== 'W') // rockets cannot be tasks
            .reduce((tot, color) => [...tot, ...NUMBERS.map((number) => ({ color, number }))], []);

        [...Array(count)].forEach(() => {
            // get random card
            const i = Math.floor(Math.random() * cards.length);
            const temp = cards[i];
            cards[i] = cards[cards.length - 1];
            cards[cards.length - 1] = temp;
            const card = cards.pop();

            // push to task type depending on task requirements
            if (taskReqs[TASK_TYPES.FIRST]) {
                tasks.push(buildTask(card, TASK_TYPES.FIRST));
                taskReqs[TASK_TYPES.FIRST] = 0;
            } else if (taskReqs[TASK_TYPES.LAST]) {
                tasks.push(buildTask(card, TASK_TYPES.LAST));
                taskReqs[TASK_TYPES.LAST] = 0;
            } else if (taskReqs[TASK_TYPES.ORDERED]) {
                tasks.push(
                    buildTask(card, TASK_TYPES.ORDERED, orderIndex - taskReqs[TASK_TYPES.ORDERED])
                );
                taskReqs[TASK_TYPES.ORDERED]--;
            } else {
                tasks.push(buildTask(card, TASK_TYPES.UNORDERED));
            }
        });

        return tasks;
    },
    /**
     * Checks who won the round, then returns updated played and tasks objects.
     *
     * @param currentRound - list of 4 cards played
     * @param tasks - task completion status
     */
    checkGameState: (currentRound, tasks) => {
        // check who wins current round
        const winner = currentRound.reduce(
            (lead, card) =>
                !lead ||
                (card.color === lead.color && card.number > lead.number) ||
                (card.color === 'W' && lead.color !== 'W')
                    ? card
                    : lead,
            null
        );

        const gameState = {
            isLost: false,
            tasks,
        };

        const isTaskCompleted = (task) =>
            currentRound.some(
                (card) =>
                    card.color === task.color &&
                    card.number === task.number &&
                    winner.userId === task.userId
            );

        // check if unordered task has been completed
        let i = tasks.unordered.findIndex(isTaskCompleted);
        if (i > -1) {
            tasks.unordered.splice(i, 1);
            if (tasks.first) {
                gameState.isLost = true;
            }
            return gameState;
        }

        // check if ordered task has been completed
        i = tasks.ordered.findIndex(isTaskCompleted);
        if (i > -1) {
            tasks.ordered.splice(i, 1);
            if (i > 0 || tasks.first) {
                gameState.isLost = true;
            }
            return gameState;
        }

        // check first
        if (tasks.first && isTaskCompleted(tasks.first)) {
            tasks.first = null;
            return gameState;
        }

        // check last
        if (tasks.last && isTaskCompleted(tasks.last)) {
            tasks.last = null;
            if (tasks.unordered.length || tasks.ordered.length || tasks.first) {
                gameState.isLost = true;
            }
            return gameState;
        }
    },
};
