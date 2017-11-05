const fs = require('fs')
// const {reportMemory} = require('./util.js')
const brotli = require('iltorb')
const zstd = require('node-zstd')
const shortid = require('shortid')
const jsbinary = require('js-binary')

const schema = new jsbinary.Type([{
    objectId: 'uint',
    objectTypeId: 'uint',
    x: 'uint',
    z: 'uint',
}])

let sqkm = 1000

genChunk(sqkm)

function genChunk(sqkm) {
    let x = 0
    let z = 0
    let i = 0

    let mapDataString = ''
    let mapData = []

    while (z < sqkm) {
        x = 0
        while (x < sqkm) {
            // let objectId = shortid.generate()
            let objectId = i
            let objectTypeId = (Math.round(Math.random() * 255))
            mapDataString += `${objectId},${objectTypeId},${x},${z}\n`
            mapData[i] = {objectId, objectTypeId, x, z}

            i += 1
            x += 1
        }
        z += 1
    }
    console.log(`Put ${i} entities into memory`)

    let encoded = schema.encode(mapData)
    fs.writeFileSync(`${sqkm}-mapData-csv.dat`, mapDataString)
    fs.writeFileSync(`${sqkm}-mapData-binary.dat`, encoded)

    let buffer = Buffer.from(mapDataString, 'utf8')

    let bopts = {
        // quality: 9,
    }
    let zopts = {
        level: 22,
    }

    console.time('compress brotli')
    brotli.compress(buffer, bopts, (err, output) => {
        // console.timeEnd('compress brotli')
        // fs.writeFileSync('mapData-brotli.dat', output)

        console.time('compress zstd')
        zstd.compress(output, zopts, (err, zoutput) => {
            // console.timeEnd('compress zstd')
            fs.writeFileSync(`${sqkm}-mapData-brotli-zstd.dat`, zoutput)

            let rawSize = fs.statSync(`${sqkm}-mapData-csv.dat`).size
            let compressedSize = fs.statSync(`${sqkm}-mapData-brotli-zstd.dat`).size
            // let bytesPerTile = rawSize / i
            console.log(`\n${sqkm} ----`)
            console.log(`Raw: ${rawSize / i}`)
            console.log(`Compressed: ${compressedSize / i}`)
        })
    })

    brotli.compress(encoded, bopts, (err, output) => {
        zstd.compress(output, zopts, (err, zoutput) => {
            fs.writeFileSync(`${sqkm}-mapData-binary-brotli-zstd.dat`, zoutput)

            let compressedSize = fs.statSync(`${sqkm}-mapData-binary-brotli-zstd.dat`).size
            console.log(`Binary Compressed: ${compressedSize / i}`)
        })
    })
}
