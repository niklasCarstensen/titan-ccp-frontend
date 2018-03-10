
import Vue from "vue";
import HelloDecorator from "./components/HelloDecorator.vue";

let v = new Vue({
    el: "#app",
    template: `
    <div>
    <div>
        Name: <input v-model="name" type="text">
        <hello-decorator :name="name" :initialEnthusiasm="5" />
    </div>
        <cluster-decorator />
    </div>
    `,
    data: { name: "World" },
    components: {
        HelloDecorator
    }
});