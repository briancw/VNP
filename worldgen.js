// Fractional Brownian Motion function derived from combining Fast-simplex-noise library, and pseudocode from this Google Post
// https://code.google.com/archive/p/fractalterraingeneration/wikis/Fractional_Brownian_Motion.wiki

const OpenSimplex = require('open-simplex-noise').default
let simplex = new OpenSimplex(Date.now())

const fbmOpts = {
    octaves: 12,
    amplitude: 0.5, // try using persistence
    frequency: 0.08,
    persistence: 0.5, // also called gain
    lacunarity: 2, // 2 is standard
    // octaves: 1,
    // amplitude: 1,
    // frequency: 1,
    // persistence: 1,
    // lacunarity: 2,
}

function fbm([x, y, z], {octaves, amplitude, frequency, persistence, lacunarity}) {
    let maxAmplitude = 0
    let noise = 0

    for (let i = 0; i < octaves; i++) {
        noise += simplex.noise3D(x * frequency, y * frequency, z * frequency) * amplitude
        maxAmplitude += amplitude
        amplitude *= persistence
        frequency *= lacunarity
    }

    return noise / maxAmplitude
}

function genData(newSeed = true) {
    if (newSeed) {
        simplex = new OpenSimplex(Date.now())
    }

    let circumference = 100
    let radius = (circumference / Math.PI) / 2
    let map = []
    let i = 0

    for (let y = 0; y < circumference; y += 1) {
        for (let x = 0; x < circumference; x += 1) {
            // let coords = latlngToCarteisan(x, y)
            let latlng = flatToLatlng(x, y, radius)
            // console.log(latlng)
            let coords = latlngToCarteisan(latlng, radius)
            // console.log(coords)
            let height = fbm(coords, fbmOpts)
            map[i] = (height + 1) / 2
            i += 1
        }
    }

    return map
}

function flatToLatlng(x, y, radius) {
    let lon = x / radius
    let lat = (2 * Math.atan(Math.exp(y / radius))) - (Math.PI / 2)
    return [lat, lon]
}

function latlngToCarteisan([lat, lon], radius) {
    let x = radius * Math.cos(lat) * Math.cos(lon)
    let y = radius * Math.cos(lat) * Math.sin(lon)
    let z = radius * Math.sin(lat)
    return [x, y, z]
}

// function cartesianToLatlng(x, y, z, radius) {
//     let lat = Math.asin(z / radius)
//     let lon = Math.atan2(y, x)
//     return [lat, lon]
// }

// function genData() {
//     let diameter = 100
//     let x = 0
//     let y = 0
//     let z = 0
//     let i = 0
//     let map = []
//
//     //  x,z
//     while (z < diameter) {
//         while (x < diameter) {
//             let scaledX = x / (diameter / 10)
//             let scaledY = y / (diameter / 10)
//             let scaledZ = z / (diameter / 10)
//
//             map[i] = fbm(scaledX, scaledY, scaledZ, fbmOpts)
//             x += 1
//             i += 1
//         }
//         x = 0
//         z += 1
//     }
//
//     // y,z
//     y = 0
//     z = 0
//     while (y < diameter) {
//         while (z < diameter) {
//             let scaledX = x / (diameter / 10)
//             let scaledY = y / (diameter / 10)
//             let scaledZ = z / (diameter / 10)
//
//             map[i] = fbm(scaledX, scaledY, scaledZ, fbmOpts)
//             z += 1
//             i += 1
//         }
//         z = 0
//         y += 1
//     }
//
//     // x,y
//     x = 0
//     y = 0
//     z = diameter
//     while (y < diameter) {
//         while (x < diameter) {
//             let scaledX = x / (diameter / 10)
//             let scaledY = y / (diameter / 10)
//             let scaledZ = z / (diameter / 10)
//
//             map[i] = fbm(scaledX, scaledY, scaledZ, fbmOpts)
//             x += 1
//             i += 1
//         }
//         x = 0
//         y += 1
//     }
//
//     // y,z
//     x = diameter
//     y = 0
//     z = diameter
//     while (y < diameter) {
//         while (z > 0) {
//             let scaledX = x / (diameter / 10)
//             let scaledY = y / (diameter / 10)
//             let scaledZ = z / (diameter / 10)
//
//             map[i] = fbm(scaledX, scaledY, scaledZ, fbmOpts)
//             z -= 1
//             i += 1
//         }
//         z = diameter
//         y += 1
//     }
//
//     // x,y
//     x = diameter
//     y = 0
//     z = 0
//     while (y < diameter) {
//         while (x > 0) {
//             let scaledX = x / (diameter / 10)
//             let scaledY = y / (diameter / 10)
//             let scaledZ = z / (diameter / 10)
//
//             map[i] = fbm(scaledX, scaledY, scaledZ, fbmOpts)
//             x -= 1
//             i += 1
//         }
//         x = diameter
//         y += 1
//     }
//
//     // x,z
//     x = 0
//     y = diameter
//     z = diameter
//     while (z > 0) {
//         while (x < diameter) {
//             let scaledX = x / (diameter / 10)
//             let scaledY = y / (diameter / 10)
//             let scaledZ = z / (diameter / 10)
//
//             map[i] = fbm(scaledX, scaledY, scaledZ, fbmOpts)
//             x += 1
//             i += 1
//         }
//         x = 0
//         z -= 1
//     }
//     return map
// }

module.exports = {
    genData,
}
