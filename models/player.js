const Sequelize = require('sequelize')
const sequelize = require('./db.js')

const Model = sequelize.define('player', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    username: {
        type: Sequelize.STRING,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
    },
})

module.exports = Model
