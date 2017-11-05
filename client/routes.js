import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

/**
 * Helper function for loading components
 * @param  {String} templateName    Name of the component to load
 * @return {Function<Promise>}       A Promise, in an function, in an enigma
 */
function loadPage(templateName) {
    // TODO switch to import when that's a bit more stable
    return () => System.import(`./components/${templateName}.vue`)
}

const index = loadPage('index')
const map = loadPage('map')

const routes = [
    {path: '/', component: index, meta: {title: 'Welcome'}},
    {path: '/map', component: map, meta: {title: 'Welcome'}},
]

let router = new Router({
    mode: 'history',
    routes,
})

export default router
