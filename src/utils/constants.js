module.exports = {
    COLORS: ['R', 'G', 'B', 'Y', 'W'],
    NUMBERS: [...Array(9)].map((_, i) => i + 1),
    ROCKETS: [...Array(4)].map((_, i) => i + 1),
    TASK_TYPES: {
        UNORDERED: 'UNORDERED',
        ORDERED: 'ORDERED',
        FIRST: 'FIRST',
        LAST: 'LAST',
    },
};
