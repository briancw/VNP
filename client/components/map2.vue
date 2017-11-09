<template>
    <div>
        <a href="#" @click.prevent="getMapData">Download and Render</a>
        <br />
        <a href="#" @click.prevent="threeStuff">Run Three</a>
        <br />

        <canvas id="canvas"></canvas>
    </div>
</template>

<script>
import axios from 'axios'
import * as THREE from 'three'
const OrbitControls = require('three-orbit-controls')(THREE)
export default {
    mounted() {
        this.terrain_canvas = document.getElementById('canvas')
        this.ctx = this.terrain_canvas.getContext('2d')

        window.ctx = this.ctx
        window.terrain_canvas = this.terrain_canvas
    },
    data() {
        return {
            tileWidth: 1,
            circumference: 1024,
        }
    },
    methods: {
        threeStuff() {
            this.initThree()
            this.animate()
        },
        getMapData() {
            axios.get('http://localhost:3005/world-data')
            .then(res => {
                let mapData = res.data
                this.mapData = mapData

                // console.log(this.mapData)

                this.drawMap()
            })
        },
        drawMap() {
            // let diameter = Math.sqrt(this.mapData.length)

            this.terrain_canvas.width = (this.circumference * this.tileWidth)
            this.terrain_canvas.height = (this.circumference * this.tileWidth / 2)
            this.ctx.clearRect(0, 0, this.circumference, this.circumference)

            let i = 0
            for (let y = 0; y < this.circumference / 2; y += 1) {
                for (let x = 0; x < this.circumference; x += 1) {
                    let height = this.mapData[i]
                    this.drawTile(height, x, y)
                    i += 1
                }
            }
        },
        drawTile(height, x, y) {
            if (height > 0.8) {
                this.ctx.fillStyle = this.luminance('#7A8781', height - 0.8)
            } else if (height > 0.7) {
                this.ctx.fillStyle = this.luminance('#59842A', height - 0.7)
            } else if (height > 0.6) {
                this.ctx.fillStyle = this.luminance('#4C7124', height - 0.65)
            } else if (height > 0.56) {
                this.ctx.fillStyle = this.luminance('#326800', height - 0.56)
            } else if (height > 0.582) { // upper beach
                this.ctx.fillStyle = this.luminance('#B58233', height - 0.582)
            } else if (height > 0.56) { // beach
                this.ctx.fillStyle = this.luminance('#DDCB75', height - 0.56)
            } else { // ocean
                this.ctx.fillStyle = this.luminance('#254e78', height)
            }

            this.ctx.fillRect(x * this.tileWidth, y * this.tileWidth, this.tileWidth, this.tileWidth)
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
        initThree() {
            this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10)
            this.camera.position.z = 1

            let controls = new OrbitControls(this.camera)

            this.scene = new THREE.Scene()

            let geometry = new THREE.SphereGeometry(0.5, 32, 32)
            // let geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)

            let texture = new THREE.TextureLoader().load('/surface.png')

            let material = new THREE.MeshBasicMaterial({map: texture, overdraw: 0.5})
            // let material = new THREE.MeshNormalMaterial()

            this.mesh = new THREE.Mesh(geometry, material)
            this.scene.add(this.mesh)

            this.renderer = new THREE.WebGLRenderer({ antialias: true })
            this.renderer.setSize(window.innerWidth, window.innerHeight)
            document.body.appendChild(this.renderer.domElement)
        },
        animate() {
            requestAnimationFrame(this.animate)

            this.renderer.render(this.scene, this.camera)
        },
    },
}
</script>
