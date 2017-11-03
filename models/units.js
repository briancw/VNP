// File backed type

const fs = require('fs')
const shortid = require('shortid')
let Units = {}

Units.find = function(userId) {
    return new Promise((resolve, reject) => {
        let filePath = `./mapdata/units/${userId}`
        if (fs.existsSync(filePath)) {
            let units = []
            let unitsRaw = fs.readFileSync(filePath, 'utf8').split('\n')
            unitsRaw.pop()
            unitsRaw.forEach((line, i) => {
                units[i] = line.split(',')
            })
            resolve(units)
        } else {
            reject('No Units found')
        }
    })
}

Units.create = function(userId, unitTpyeId, x, z) {
    return new Promise((resolve, reject) => {
        let filePath = `./mapdata/units/${userId}`
        let unitId = shortid.generate()
        let unitString = `${unitId},${userId},${unitTpyeId},${x},${z}\n`

        if (fs.existsSync(filePath)) {
            fs.appendFileSync(filePath, unitString)
            resolve()
        } else {
            fs.writeFileSync(filePath, unitString)
            resolve()
            // reject()
        }
    })
}

module.exports = Units
