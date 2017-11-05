const fs = require('fs')
const shortid = require('shortid')
const Type = require('js-binary').Type

// let objectId = shortid.generate()
// let objectTypeId = (Math.round(Math.random() * 255))
// let objectId = 'B1enk290b'
let objectId = 10000000
let objectTypeId = 50
let x = 10
let z = 20

const units = [
    {objectId, objectTypeId, x, z},
    {objectId, objectTypeId, x, z},
    {objectId, objectTypeId, x, z},
    {objectId, objectTypeId, x, z},
    {objectId, objectTypeId, x, z},
]

const schema = new Type([{
    // objectId: 'string',
    objectId: 'uint',
    objectTypeId: 'uint',
    x: 'uint',
    z: 'uint',
}])

const encoded = schema.encode(units)
const csv = `${objectId},${objectTypeId},${x},${z}\n${objectId},${objectTypeId},${x},${z}\n${objectId},${objectTypeId},${x},${z}\n${objectId},${objectTypeId},${x},${z}\n${objectId},${objectTypeId},${x},${z}\n`

console.log(csv)
console.log(encoded)
console.log(schema.decode(encoded))

fs.writeFileSync('binary.bin', encoded)
fs.writeFileSync('csv.dat', csv)

// buffer.write(objectId)
// console.log(buffer)
// console.log(buffer.toString())

// bin: 13, csv: 19
