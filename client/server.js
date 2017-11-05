const express = require('express')
const path = require('path')

const {genData} = require('../worldgen.js')

const app = express()

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'test-map.html'))
})

app.get('/world-data', (req, res) => {
    let map = genData()
    res.send(map)
})

app.listen(3005)
