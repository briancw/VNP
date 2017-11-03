const brotli = require('iltorb')
const zstd = require('node-zstd')

const fs = require('fs')

// fs.createReadStream('1000-mapData-brotli-zstd.dat')
// .pipe(zstd.decompressStream())
// .pipe(brotli.decompressStream())
// .pipe(fs.createWriteStream('decompress.dat'))

console.time('read')
fs.readFile('1000-mapData-brotli-zstd.dat', (err, data) => {
    if (err) {
        console.error(err)
    }

    zstd.decompress(data, (err, data) => {
        if (err) {
            console.error(err)
        }

        brotli.decompress(data, (err, data) => {
            if (err) {
                console.error(err)
            }

            fs.writeFileSync('decompressed.dat', data)
            console.timeEnd('read')
        })
    })
})
