import Vue from "vue";
import HelloDecorator from "./components/HelloDecorator.vue";
import AxiosExample from "./components/AxiosExample.vue";
import CanvasTimeSeriesPlotExample from "./components/CanvasTimeSeriesPlotExample.vue";

let v = new Vue({
    el: "#app",
    template: `
    <div>
        <div>
            Name: <input v-model="name" type="text">
            <hello-decorator :name="name" :initialEnthusiasm="5" />
        </div>
        <axios-example />
        <canvas-time-series-plot-example />
    </div>
    `,
    data: { name: "World" },
    components: {
        HelloDecorator,
        AxiosExample,
        CanvasTimeSeriesPlotExample
    }
});

