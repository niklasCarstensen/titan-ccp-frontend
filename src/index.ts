import Vue from "vue";
import BootstrapVue from 'bootstrap-vue';
import App from "./components/App.vue";

Vue.use(BootstrapVue);

let v = new Vue({   
    el: "#app",
    template: `
    <div>
        <app />
    </div>
    `,
    components: {
        App
    }
});

