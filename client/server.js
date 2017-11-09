const express = require('express')
const path = require('path')
const history = require('connect-history-api-fallback')

const {genData, setSeed} = require('../worldgen.js')

const app = express()
app.use(history({index: '/'}))
// app.use('/dist', express.static(path.resolve(__dirname, 'dist')))
app.use(express.static(path.resolve(`${__dirname}/public`)))

app.get('/', (req, res) => {
    // res.sendFile(path.resolve(__dirname, 'test-map.html'))
    res.sendFile(path.resolve(__dirname, 'index.html'))
})

app.get('/world-data', (req, res) => {
    let {startX, startY, endX, endY, resolution, seed} = req.query
    if (seed) {
        setSeed(seed)
    }

    let map = genData(startX, startY, endX, endY, resolution)
    res.send(map)
})

app.listen(3005)
