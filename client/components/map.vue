<template>
    <div>
        <a href="#" @click.prevent="getMapData">Download and Render</a>
        <br />

        <canvas id="canvas" width="1000" height="1000"></canvas>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    mounted() {
        const terrain_canvas = document.getElementById('canvas')
        this.ctx = terrain_canvas.getContext('2d')

        window.ctx = this.ctx
    },
    data() {
        return {
            tileWidth: 3,
        }
    },
    methods: {
        getMapData() {
            axios.get('http://localhost:3005/world-data')
            .then(res => {
                let mapData = res.data
                let diameter = Math.sqrt(mapData.length)

                this.drawMap(mapData, diameter)
            })
        },
        drawMap(mapData, diameter) {
            let x = 0
            let z = 0
            let i = 0

            console.log(mapData)

            while (x < diameter) {
                while (z < diameter) {
                    let height = mapData[i]

                    height = (height + 1) / 2

                    if (height > 0.8) {
                        this.ctx.fillStyle = this.luminance('#7A8781', height - 0.8)
                    } else if (height > 0.7) {
                        this.ctx.fillStyle = this.luminance('#59842A', height - 0.7)
                    } else if (height > 0.6) {
                        this.ctx.fillStyle = this.luminance('#4C7124', height - 0.65)
                    } else if (height > 0.56) {
                        this.ctx.fillStyle = this.luminance('#326800', height - 0.56)
                    // } else if(height > 0.582){ // upper beach
                        // this.ctx.fillStyle = this.luminance('#B58233', height - 0.582);
                    // } else if(height > 0.56){ // beach
                        // this.ctx.fillStyle = this.luminance('#DDCB75', height - 0.56);
                    } else { // ocean
                        this.ctx.fillStyle = this.luminance('#254e78', height)
                    }

                    this.ctx.fillRect(x * this.tileWidth, z * this.tileWidth, this.tileWidth, this.tileWidth)
                    z += 1
                    i += 1
                }
                z = 0
                x += 1
            }
        },
        luminance(hex, lum) {
        	// validate hex string
            hex = String(hex).replace(/[^0-9a-f]/gi, '')
            if (hex.length < 6) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
            }
            lum = lum || 0

        	// convert to decimal and change luminosity
            var rgb = '#'
            var c
            var i

            for (i = 0; i < 3; i++) {
                c = parseInt(hex.substr(i * 2, 2), 16)
                c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16)
                rgb += ('00' + c).substr(c.length)
            }

            return rgb
        },
    },
}
</script>
