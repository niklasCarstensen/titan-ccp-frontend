import Vue from "vue";
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import HelloDecorator from "./components/HelloDecorator.vue";
import AxiosExample from "./components/AxiosExample.vue";
import CanvasTimeSeriesPlotExample from "./components/CanvasTimeSeriesPlotExample.vue";
import SensorHistoryPlot from "./components/SensorHistoryPlot.vue";
import MovingTimeSeriesPlotExample from "./components/MovingTimeSeriesPlotExample.vue";

Vue.use(BootstrapVue);

let v = new Vue({
    el: "#app",
    template: `
    <div class="container-fluid">
        <div>
            Name: <input v-model="name" type="text">
            <hello-decorator :name="name" :initialEnthusiasm="5" />
        </div>
        <!--<axios-example />-->
        <!--<canvas-time-series-plot-example />-->
        <!--<sensor-history-plot />-->
        <moving-time-series-plot-example />
    </div>
    `,
    data: { name: "World" },
    components: {
        HelloDecorator,
        AxiosExample,
        CanvasTimeSeriesPlotExample,
        SensorHistoryPlot,
        MovingTimeSeriesPlotExample
    }
});

