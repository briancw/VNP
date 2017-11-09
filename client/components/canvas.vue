<template>
    <div>
        <a href="#" @click.prevent="go">Render</a>
        <br />

        <canvas id="canvas" width="1000" height="1000"></canvas>
    </div>
</template>

<script>
import axios from 'axios'
import * as THREE from 'three'
export default {
    mounted() {
        this.terrain_canvas = document.getElementById('canvas')
        this.ctx = this.terrain_canvas.getContext('2d')

        window.ctx = this.ctx
        window.terrain_canvas = this.terrain_canvas
    },
    data() {
        return {
            tileWidth: 10,
        }
    },
    methods: {
        go() {
            let circumference = 100
            let radius = (circumference / Math.PI) / 2

            let points = []

            for (let y = 0; y < circumference / 2; y += 1) {
                for (let x = 0; x < circumference; x += 1) {
                    // let latLng = this.flatToLatlngMercator(x, y, radius)
                    let latLng = this.flatToLatlngEqui(x, y, circumference, circumference / 2)
                    // points.push(latLng)
                    let cart = this.latlngToCarteisan(latLng, radius)
                    let [cartX, cartY, cartZ] = cart

                    cartX += 20
                    cartY += 20
                    cartZ += 20

                    this.ctx.fillRect(cartX * this.tileWidth, cartZ * this.tileWidth, 1, 1)
                    // points.push(cart)
                }
            }

            console.log(points)
        },
        flatToLatlngEqui(x, y, mapWidth, mapHeight) {
            let lon = ((x * 360) / (mapWidth)) - 180
            let lat = ((y * 180) / (mapHeight)) - 90
            // Convert degrees to radians
            lon *= (Math.PI / 180)
            lat *= (Math.PI / 180)

            return [lat, lon]
        },
        // flatToLatlngMercator(x, y, radius) {
        //     // This appears to be legit Mercator.
        //     // The north pole is 85.051128 degrees which has something to do with the wiki about mercator converging
        //     let lon = x / radius
        //     let lat = (2 * Math.atan(Math.exp(y / radius))) - (Math.PI / 2)
        //
        //     // console.log(lat * (180 / Math.PI), lon * (180 / Math.PI))
        //
        //     return [lat, lon]
        //     // returns Radians
        //     // Need to do result * (180 / Math.PI) in order to see in degrees
        // },
        // flatToLatlngAzi(x, y, radius) {
        //     let mapWidth = 100
        //     // I think this is Azithmul equidistant projection, but I'm not sure yet
        //     // var lat = (y / (mapWidth / 180) - 90) / -1
        //     // var lon = x / (mapWidth / 360) - 180
        //     return [lat, lon]
        // },
        latlngToCarteisan([lat, lon], radius) {
            let x = radius * Math.cos(lat) * Math.cos(lon)
            let y = radius * Math.cos(lat) * Math.sin(lon)
            let z = radius * Math.sin(lat)

            // let x = radius * Math.cos(lon) * Math.sin(lat)
            // let y = radius * Math.sin(lon) * Math.sin(lat)
            // let z = radius * Math.cos(lat)
            return [x, y, z]
        },
    },
}
</script>
