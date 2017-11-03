const Sequelize = require('sequelize')
const sequelize = new Sequelize({
    dialect: 'postgres',
    database: 'vnp',
    username: 'vnp',
    host: 'localhost',
    port: '5432',
    password: 'vnp-password',
    logging: false,
})

module.exports = sequelize
