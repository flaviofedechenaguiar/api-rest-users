const Sequelize = require('sequelize');
const connection = new Sequelize('api-database', 'root', '', {
    host: 'mysql-container',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection; 