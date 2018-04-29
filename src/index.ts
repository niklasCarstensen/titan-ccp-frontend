import Vue from "vue";
import HelloDecorator from "./components/HelloDecorator.vue";
import HelloDecorator1 from "./components/HelloDecorator.1.vue";
import ExampleChart from "./components/ExampleChart.vue";

let v = new Vue({
    el: "#app",
    template: `
    <div>
        <div>
            Name: <input v-model="name" type="text">
            <hello-decorator :name="name" :initialEnthusiasm="5" />
        </div>
        <hello-decorator-1 />
        <example-chart />
    </div>
    `,
    data: { name: "World" },
    components: {
        HelloDecorator,
        HelloDecorator1,
        ExampleChart
    }
});

