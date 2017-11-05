// Fractional Brownian Motion function derived from combining Fast-simplex-noise library, and pseudocode from this Google Post
// https://code.google.com/archive/p/fractalterraingeneration/wikis/Fractional_Brownian_Motion.wiki

const OpenSimplex = require('open-simplex-noise').default
let simplex = new OpenSimplex(Date.now())

const fbmOpts = {
    octaves: 12,
    amplitude: 1, // try using persistence
    frequency: 0.315,
    persistence: 0.5, // also called gain
    lacunarity: 2, // 2 is standard
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
