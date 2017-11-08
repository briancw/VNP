<template>
    <div>
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
    },
    data() {
        return {
            x: 0,
            y: 0,
            circumference: 100,
            radius: ((100 / Math.PI) / 2),
        }
    },
    methods: {
        threeStuff() {
            this.initThree()
            this.animate()
            // this.interval = setInterval(this.addPoint, 100)
        },
        initThree() {
            this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10)
            // this.camera.position.z = 1
            this.camera.position.set(0, 1, -3)
            this.camera.lookAt(new THREE.Vector3())

            let controls = new OrbitControls(this.camera)

            this.scene = new THREE.Scene()

            this.geometry = new THREE.SphereGeometry(1, 32, 32)
            // this.geometry = new THREE.BoxGeometry(0.01, 0.01, 0.01)

            let texture = new THREE.TextureLoader().load('/surface.png')

            this.material = new THREE.MeshBasicMaterial({map: texture, overdraw: 0.5})
            // this.material = new THREE.MeshNormalMaterial()

            this.mesh = new THREE.Mesh(this.geometry, this.material)
            this.scene.add(this.mesh)
            // this.camera.lookAt(this.mesh)

            this.renderer = new THREE.WebGLRenderer({ antialias: true })
            this.renderer.setSize(window.innerWidth, window.innerHeight)
            document.body.appendChild(this.renderer.domElement)
        },
        animate() {
            requestAnimationFrame(this.animate)

            // this.mesh.rotation.y += 0.02 // around west to east
            // this.mesh.rotation.x -= 0.001

            this.renderer.render(this.scene, this.camera)
        },
        addPoint() {
            if (this.y < this.circumference) {
                if (this.x < this.circumference) {
                    let latlng = this.flatToLatlng(this.x, this.y, this.radius)
                    let coords = this.latlngToCarteisan(latlng, this.radius)

                    let newBox = new THREE.Mesh(this.geometry, this.material)
                    this.scene.add(newBox)
                    newBox.position.set(coords[0] / 30, coords[1] / 30, coords[2] / 30)

                    this.x += 1
                } else {
                    this.x = 0
                    this.y += 1
                }
            } else {
                clearInterval(this.interval)
                console.log('done')
            }
        },
        flatToLatlng(x, y, radius) {
            let lon = x / radius
            let lat = (2 * Math.atan(Math.exp(y / radius))) - (Math.PI / 2)

            // var lat = (y / (100 / 180) - 90) / -1
            // var lon = x / (100 / 360) - 180
            return [lat, lon]
        },
        latlngToCarteisan([lat, lon], radius) {
            let x = radius * Math.cos(lat) * Math.cos(lon)
            let y = radius * Math.cos(lat) * Math.sin(lon)
            let z = radius * Math.sin(lat)
            return [x, y, z]
        },
    },
}
</script>
