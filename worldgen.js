const OpenSimplex = require('open-simplex-noise').default
let simplex = new OpenSimplex(Date.now())

// for each pixel, get the value
// total = 0.0f;
// frequency = 1.0 * f / hgrid;
// amplitude = gain;
//
// for (i = 0; i < octaves; ++i) {
//     total += noise(x * frequency, y * frequency) * amplitude;
//     frequency *= lacunarity;
//     amplitude *= gain;
// }

// octaves: 12, frequency: 0.315, persistence: 0.5

const fbmOpts = {
    octaves: 8,
    amplitude: 1, // try using persistence
    frequency: 0.315,
    persistence: 0.5, // also called gain
    lacunarity: 2,
}

function fbm(x, z, {octaves, amplitude, frequency, persistence, lacunarity}) {
    let maxAmplitude = 0
    let noise = 0

    for (let i = 0; i < octaves; i++) {
        noise += simplex.noise2D(x * frequency, z * frequency) * amplitude
        maxAmplitude += amplitude
        amplitude *= persistence
        frequency *= lacunarity
    }

    return noise / maxAmplitude
}

function genData() {
    let diameter = 500
    let x = 0
    let z = 0
    let i = 0
    let map = []

    while (x < diameter) {
        while (z < diameter) {
            let scaledX = x / (diameter / 10)
            let scaledZ = z / (diameter / 10)
            // map[i] = simplex.noise2D(scaledX, scaledZ)
            map[i] = fbm(scaledX, scaledZ, fbmOpts)
            z += 1
            i += 1
        }
        z = 0
        x += 1
    }

    return map
}

module.exports = {
    genData,
}
