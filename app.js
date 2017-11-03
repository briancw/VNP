const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
const port = 3000
const secretKey = 'super_secret_key'

const Player = require('./models/player.js')
const Units = require('./models/units.js')

app.get('/', (req, res) => {
    res.send({currentRoutes: [
        'signup',
        'login',
        'units',
        'move-unit',
    ]})
})

app.post('/signup', (req, res) => {
    let {username, password} = req.body
    if (username && password) {
        Player.create({
            username,
            password,
        })
        .then((player) => {
            console.log(player.id)
            Units.create(player.id, 1, 1, 1)
            res.send('Signed up')
        })
        .catch(() => {
            res.send('Error!')
        })
    } else {
        res.send('Missing required params')
    }
})

app.post('/login', (req, res) => {
    if (req.body.username && req.body.password) {
        let username = req.body.username
        let password = req.body.password

        Player.findOne({
            where: {
                username,
                password,
            },
        })
        .then(user => {
            if (user) {
                let token = jwt.sign({username, uuid: user.id}, secretKey, {expiresIn: '30m'})
                res.send({token})
            } else {
                res.send('bad')
            }
        })
        .catch(err => {
            console.error(err)
            res.send('Nope')
        })
    } else {
        res.send('Missing stuff')
    }
})

app.get('/help', (req, res) => {
    res.send('Available Actions:')
})

app.get('/units', (req, res) => {
    if (req.query.token) {
        let token = req.query.token
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                console.error(err.name)
                res.send('Invalid Token')
            } else {
                console.log(decoded)
                let userId = decoded.uuid

                Units.find(userId)
                .then(units => {
                    console.log(units)
                    res.send(units)
                })
                .catch(err => {
                    console.error(err)
                    res.send('Error getting units')
                })
            }
        })
    } else {
        res.send('Requires authentication')
    }
})

app.get('/move-unit', (req, res) => {
    let {unitId, x, z} = req.query
    if (unitId && x && z) {
        Units.move(unitId, x, z)
        .then(() => {
            res.send('moving')
        })
        .catch(err => {
            console.error(err)
            res.send('error')
        })
    } else {
        res.send('Missing unit id, x, or z')
    }
})

app.get('/scan', (req, res) => {
    let scannerId = req.query.id

    if (scannerId) {
        res.send(scannerId)
    } else {
        res.send('Required: scannerId')
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
