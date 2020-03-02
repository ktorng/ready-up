const { Sequelize } = require('sequelize');

module.exports = {
    createStore: () => {
        const db = new Sequelize({
            dialect: 'sqlite',
            storage: './store.sqlite',
            logging: console.log
        });

        const users = db.define('users', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            status: {
                type: Sequelize.STRING,
                defaultValue: 'WAITING'
            },
            statusMessage: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: ''
            },
        });

        const games = db.define('games', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
            accessCode: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            visibility: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'PUBLIC'
            },
            status: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'WAITING'
            },
            size: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 4
            },
            hostId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: ''
            },
        });

        const gameUsers = db.define('game_users', {
            gameId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'games',
                    key: 'id'
                }
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            isHost: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
        });

        users.hasOne(games);
        users.hasOne(gameUsers);
        games.hasMany(gameUsers);

        return { db, users, games, gameUsers };
    }
};
