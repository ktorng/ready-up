const { Sequelize } = require('sequelize');

const createStore = () => {
    const db = new Sequelize({
        dialect: 'sqlite',
        storage: './store.sqlite',
        logging: console.log
    });

    const users = db.define('user', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
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
    }, {
        hooks: {
            beforeCreate: (user) => {
                if (!user.name) {
                    user.name = user.email.split('@')[0];
                }
            },
        },
    });

    const games = db.define('game', {
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
        description: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
    });

    const gameUsers = db.define('game_user', {
        isHost: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    });
    gameUsers.belongsTo(users);
    gameUsers.belongsTo(games);

    return { db, users, games, gameUsers };
};

module.exports = createStore();
