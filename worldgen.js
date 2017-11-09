// TODO connect the genData function to something that outputs basic shapes rather than world data in order to test that projection is working as intended

const OpenSimplex = require('open-simplex-noise').default
let simplex = new OpenSimplex(Date.now())

const worldCircumference = 1024
const worldRadius = (worldCircumference / Math.PI) / 2
const fbmOpts = {
    octaves: 12,
    amplitude: 0.5, // try using persistence
    frequency: 0.01,
    persistence: 0.5, // also called gain
    lacunarity: 2, // 2 is standard
}

function setSeed(seed) {
    simplex = new OpenSimplex(seed)
}

function genData() {
    let map = []
    let i = 0

    for (let y = 0; y < worldCircumference / 2; y += 1) {
        for (let x = 0; x < worldCircumference; x += 1) {
            let latlng = flatToLatlng(x, y, worldCircumference, worldCircumference / 2)
            let coords = latlngToCarteisan(latlng, worldRadius)
            let height = fbm(coords, fbmOpts)
            map[i] = height
            i += 1
        }
    }

    return map
}

/**
 * Fractional Brownian Motion, which applies layers of self similar fractal like noise
 * Derived from combining Fast-simplex-noise library, and pseudocode from this Google Post
 * https://code.google.com/archive/p/fractalterraingeneration/wikis/Fractional_Brownian_Motion.wiki
 * @param  {Array}  coords      An array of cartesian coordinates [x, y, z]
 * @param  {Number} octaves     How many layers of noise to apply
 * @param  {Number} amplitude   [description]
 * @param  {Number} frequency   [description]
 * @param  {Number} persistence [description]
 * @param  {Number} lacunarity  [description]
 * @return {Number}             A noise value between 0 and 1
 */
function fbm([x, y, z], {octaves, amplitude, frequency, persistence, lacunarity}) {
    let maxAmplitude = 0
    let noise = 0

    for (let i = 0; i < octaves; i++) {
        noise += simplex.noise3D(x * frequency, y * frequency, z * frequency) * amplitude
        maxAmplitude += amplitude
        amplitude *= persistence
        frequency *= lacunarity
    }

    noise /= maxAmplitude
    noise = (noise + 1) / 2
    return noise / maxAmplitude
}

/**
 * Convert x,y coordinates from a flat map to Latitude and Longitude
 * @param  {Number} x           The x coordinate representing a pixel in a flat map
 * @param  {Number} y           The y coordinate representing a pixel in a flat map
 * @param  {Number} mapWidth    The width of the rectangle of the map of the world
 * @param  {Number} mapHeight   The height of the rectangle of the map of the world
 * @return {Array}              Latitude Longitude coordinates [lat, lon]
 */
function flatToLatlng(x, y, mapWidth, mapHeight) {
    let lon = ((x * 360) / (mapWidth)) - 180
    let lat = ((y * 180) / (mapHeight)) - 90

    // Convert degrees to radians
    lon *= (Math.PI / 180)
    lat *= (Math.PI / 180)

    return [lat, lon]
}

/**
 * Convert latitude and longitude to 3D cartesian coordinates (xyz)
 * Can convert both Equirectangular and Mercator to cartesian (I think. Its not well tested)
 * @param  {Array}  coords  Coordinates, latitude and longitude
 * @param  {Number} radius  The radius of sphere being projected to
 * @return {Array}          Cartesian coordinates, [x, y, z]
 */
function latlngToCarteisan([lat, lon], radius) {
    let x = radius * Math.cos(lat) * Math.cos(lon)
    let y = radius * Math.cos(lat) * Math.sin(lon)
    let z = radius * Math.sin(lat)
    return [x, y, z]
}

module.exports = {
    genData,
    setSeed,
}
