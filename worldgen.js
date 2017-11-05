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

function fbm(x, y, z, {octaves, amplitude, frequency, persistence, lacunarity}) {
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

function genData() {
    let diameter = 80
    let x = 0
    let y = 0
    let z = 0
    let i = 0
    let map = []

    //  x,z
    while (z < diameter) {
        while (x < diameter) {
            let scaledX = x / (diameter / 10)
            let scaledY = y / (diameter / 10)
            let scaledZ = z / (diameter / 10)

            map[i] = fbm(scaledX, scaledY, scaledZ, fbmOpts)
            x += 1
            i += 1
        }
        x = 0
        z += 1
    }

    // y,z
    y = 0
    z = 0
    while (y < diameter) {
        while (z < diameter) {
            let scaledX = x / (diameter / 10)
            let scaledY = y / (diameter / 10)
            let scaledZ = z / (diameter / 10)

            map[i] = fbm(scaledX, scaledY, scaledZ, fbmOpts)
            z += 1
            i += 1
        }
        z = 0
        y += 1
    }

    // x,y
    x = 0
    y = 0
    z = diameter
    while (y < diameter) {
        while (x < diameter) {
            let scaledX = x / (diameter / 10)
            let scaledY = y / (diameter / 10)
            let scaledZ = z / (diameter / 10)

            map[i] = fbm(scaledX, scaledY, scaledZ, fbmOpts)
            x += 1
            i += 1
        }
        x = 0
        y += 1
    }

    // y,z
    x = diameter
    y = 0
    z = diameter
    while (y < diameter) {
        while (z > 0) {
            let scaledX = x / (diameter / 10)
            let scaledY = y / (diameter / 10)
            let scaledZ = z / (diameter / 10)

            map[i] = fbm(scaledX, scaledY, scaledZ, fbmOpts)
            z -= 1
            i += 1
        }
        z = diameter
        y += 1
    }

    // x,y
    x = diameter
    y = 0
    z = 0
    while (y < diameter) {
        while (x > 0) {
            let scaledX = x / (diameter / 10)
            let scaledY = y / (diameter / 10)
            let scaledZ = z / (diameter / 10)

            map[i] = fbm(scaledX, scaledY, scaledZ, fbmOpts)
            x -= 1
            i += 1
        }
        x = diameter
        y += 1
    }

    // x,z
    x = 0
    y = diameter
    z = diameter
    while (z > 0) {
        while (x < diameter) {
            let scaledX = x / (diameter / 10)
            let scaledY = y / (diameter / 10)
            let scaledZ = z / (diameter / 10)

            map[i] = fbm(scaledX, scaledY, scaledZ, fbmOpts)
            x += 1
            i += 1
        }
        x = 0
        z -= 1
    }
    return map
}

module.exports = {
    genData,
}
