const { Sequelize } = require('sequelize');

module.exports = {
    createStore: () => {
        const db = new Sequelize({
            dialect: 'sqlite',
            storage: './store.sqlite',
        });

        const users = db.define('user', {
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
            email: Sequelize.STRING,
            status: Sequelize.STRING,
            statusMessage: Sequelize.STRING,
            gameId: Sequelize.INTEGER,
        });

        const games = db.define('game', {
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
            accessCode: Sequelize.STRING,
            status: Sequelize.STRING,
        });

        return { db, users, games };
    }
};
