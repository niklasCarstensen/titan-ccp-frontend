import Vue from "vue";
import VueRouter from "vue-router"
import BootstrapVue from 'bootstrap-vue'
import App from "./components/App.vue"

import Dashboard from "./components/Dashboard.vue"
import SensorDetails from "./components/SensorDetails.vue"
import Configuration from "./components/Configuration.vue"
import Examples from "./components/Examples.vue"

Vue.use(BootstrapVue);

Vue.use(VueRouter);

// 0. If using a module system (e.g. via vue-cli), import Vue and VueRouter
// and then call `Vue.use(VueRouter)`.

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
// We'll talk about nested routes later.
const routes = [
  { path: '/', component: Dashboard },
  { path: '/sensor-details', component: SensorDetails },
  { path: '/configuration', component: Configuration },
  { path: '/examples', component: Examples }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes: routes, // short for `routes: routes`
  mode: 'history',
})

new Vue({   
    el: '#app',
    template: '<app />',
    router: router,
    components: { App }
});

