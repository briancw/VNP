<template>
    <div>
        <div class="menu">
            <router-link to="/" class="menu_link">Index</router-link>
            <router-link to="/map" class="menu_link">Map</router-link>
            <router-link to="/canvas" class="menu_link">Canvas Tests</router-link>
        </div>
        <div class="page">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
    name: 'app',
}
</script>

<style lang="scss">
@import '../scss/reset.css';
@import '../scss/_mixins.scss';
// @import '../../node_modules/material-design-lite/material.min.css';

.menu {
    position: absolute;
    top: 0px;
    left: 0;
    bottom: 0;
    width: 80px;
    height: 100%;
    background-color: #2a2a2a;
    padding-top: 30px;

    .menu_link {
        @include roboto;
        color: #fff;
        display: block;
        text-decoration: none;
        color: rgba(255,255,255,.75);
        // padding-left: 10px;
        // height: 25px;
        padding: 5px 0px 5px 10px;
    }
}

.page {
    position: absolute;
    left: 80px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    padding-left: 10px;
    padding-top: 10px;
}
</style>
