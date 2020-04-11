const { Sequelize } = require('sequelize');

const createStore = () => {
    const db = process.env.NODE_ENV === 'production' ?
        new Sequelize(process.env.DATABASE_URL) :
        new Sequelize({
            dialect: 'sqlite',
            storage: './store.sqlite',
            logging: console.log,
        });

    const users = db.define('users', {
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
    }, {
        hooks: {
            beforeCreate: (user) => {
                if (!user.name) {
                    user.name = user.email.split('@')[0];
                }
            },
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
        gameState: Sequelize.JSON,
    });

    const gameUsers = db.define('game_users', {
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        playerState: Sequelize.JSON,
        status: {
            type: Sequelize.STRING,
            defaultValue: 'WAITING'
        },
        statusMessage: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        isHost: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    });
    gameUsers.belongsTo(users);
    gameUsers.belongsTo(games);

    return { db, users, games, gameUsers };
};

module.exports = createStore();
