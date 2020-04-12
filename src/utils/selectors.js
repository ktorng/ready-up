const { get, pick } = require('lodash');

module.exports = {
    userReducer: (user) => {
        return pick(user, [
            'id',
            'email',
            'name',
        ]);
    },
    playerReducer: (player) => {
        return {
            ...pick(player, [
                'id',
                'userId',
                'gameId',
                'status',
                'statusMessage',
                'playerState',
                'isHost',
            ]),
            name: get(player, 'user.name'),
            email: get(player, 'user.email'),
        };
    },
    gameReducer: (game) => {
        return pick(game, [
            'id',
            'accessCode',
            'name',
            'status',
            'size',
            'description',
            'gameState',
        ]);
    },
};

