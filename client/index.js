import Vue from 'vue'
import router from './routes.js'
import VueAnalytics from 'vue-analytics'

const id = 'UA-93531536-3'

import app from './components/app.vue'
Vue.use(VueAnalytics, {id, router})

new Vue({
    router,
    template: '<app />',
    components: {
        app,
    },
}).$mount('#app')
