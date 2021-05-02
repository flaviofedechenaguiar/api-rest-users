const Sequelize = require('sequelize');
const connection = require('../database/database');

const User = connection.define('Users', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    nickname: {
        type: Sequelize.STRING(30),
        allowNull: false
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false
    },
    bio: {
        type: Sequelize.STRING(100),
    }
});

User.sync({ force: false });

module.exports = User;