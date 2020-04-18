const { merge } = require('lodash');

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
     * @param reqs {Object} - task requirements; object of counts for each requirement
     * @returns {{}[]} dict of player id or "unassigned" to list of tasks
     */
    generateMission: (count, reqs) => {
        const taskReqs = { ...reqs };
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

        const gameState = { isLost: false, isWon: false };

        const isTaskCompleted = (task) =>
            currentRound.some(
                (card) =>
                    card.color === task.color &&
                    card.number === task.number &&
                    winner.playerId === task.playerId
            );

        const completedTasks = [...Array(tasks.length)].map((_, i) => ({
            isCompleted: tasks[i].isCompleted || isTaskCompleted(tasks[i]), // completed this round or previously
        }));

        // check if:
        // * tasks have been completed before first
        if (
            tasks.some(
                (task, i) => task.type === TASK_TYPES.FIRST && !completedTasks[i].isCompleted
            )
        ) {
            gameState.isLost = tasks.some(
                (task, i) => task.type !== TASK_TYPES.FIRST && completedTasks[i].isCompleted
            );
        }
        // * last was completed while other tasks remaining
        if (
            tasks.some((task, i) => task.type === TASK_TYPES.LAST && completedTasks[i].isCompleted)
        ) {
            gameState.isLost = tasks.some(
                (task, i) => task.type !== TASK_TYPES.LAST && !completedTasks[i].isCompleted
            );
        }
        // * ordered task done out of order
        if (
            tasks.some(
                (task, i) => task.type === TASK_TYPES.ORDERED && completedTasks[i].isCompleted
            )
        ) {
            // lose if max complete ordered task is greater than min incomplete ordered task
            const [a, b] = tasks.reduce(((acc, task, i) => {
                if (task.type === TASK_TYPES.ORDERED) {
                    const [max, min] = acc;

                    return [
                        completedTasks[i].isCompleted ? Math.max(max, task.order) : max,
                        !completedTasks[i].isCompleted ? Math.min(min, task.order) : min,
                    ];
                }
                return acc;
            }), [-Infinity, Infinity]);
            gameState.isLost = a > b;
        }
        // * all tasks completed
        if (tasks.every((task, i) => completedTasks[i].isCompleted)) {
            gameState.isWon = true;
        }

        gameState.tasks = merge([], tasks, completedTasks);

        return gameState;
    },
};
