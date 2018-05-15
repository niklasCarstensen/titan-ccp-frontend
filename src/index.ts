import Vue from "vue";
import BootstrapVue from 'bootstrap-vue';
import App from "./components/App.vue";

Vue.use(BootstrapVue);

new Vue({   
    el: '#app',
    template: '<app />',
    components: { App }
});

