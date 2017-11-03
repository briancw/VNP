const sequelize = require('./models/db.js')
const Player = require('./models/player.js')

sequelize.sync({force: true})
.then(() => {
    console.log('DB reset')
    process.exit()
})
.catch((e) => {
    console.log('Error Reseting DB')
    console.log(e)
    process.exit()
})
