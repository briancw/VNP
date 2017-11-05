<template>
    <div>
        <div class="menu">
            <router-link to="/" class="menu_link">Index</router-link>
            <router-link to="/map" class="menu_link">Map</router-link>
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
    width: 180px;
    height: 100%;
    background-color: #2a2a2a;
    padding-top: 30px;

    .menu_link {
        @include roboto;
        color: #fff;
        display: block;
        text-decoration: none;
        color: rgba(255,255,255,.75);
        padding-left: 10px;
        height: 25px;
    }
}

.page {
    position: absolute;
    left: 180px;
    right: 0px;
    padding-left: 20px;
    padding-top: 20px;
}
</style>
