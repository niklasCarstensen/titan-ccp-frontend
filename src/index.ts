import Vue from "vue";
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import HelloDecorator from "./components/examples/HelloDecorator.vue";
import AxiosExample from "./components/examples/AxiosExample.vue";
import CanvasTimeSeriesPlotExample from "./components/examples/CanvasTimeSeriesPlotExample.vue";
import MovingTimeSeriesPlotExample from "./components/examples/MovingTimeSeriesPlotExample.vue";
import BritechartsExample from "./components/examples/BritechartsExample.vue";
import C3Example from "./components/examples/C3Example.vue";
import C3PieExample from "./components/examples/C3PieExample.vue";

import DistributionPlot from "./components/DistributionPlot.vue";
import C3PieExample2 from "./components/C3PieExample2.vue";
import SensorHistoryPlot from "./components/SensorHistoryPlot.vue";

Vue.use(BootstrapVue);

let v = new Vue({   
    el: "#app",
    template: `
    <div>
        <b-container class="">
            <b-row>
                <b-col>
                    <b-card title="Card Title"
                            img-src="https://lorempixel.com/600/300/food/5/"
                            img-alt="Image"
                            img-top 
                            tag="article"
                            class="mb-2">
                        <p class="card-text">
                        Some quick example text to build on the card title and make up the bulk of the card's content.
                        </p>
                        <b-button href="#" variant="primary">Go somewhere</b-button>
                    </b-card>
                </b-col>
                <b-col>
                    <b-card title="Card Title"
                            img-src="https://lorempixel.com/600/300/food/5/"
                            img-alt="Image"
                            img-top 
                            tag="article"
                            class="mb-2">
                        <p class="card-text">
                        Some quick example text to build on the card title and make up the bulk of the card's content.
                        </p>
                        <b-button href="#" variant="primary">Go somewhere</b-button>
                    </b-card>
                </b-col>
                <b-col>
                    <b-card title="Card Title"
                            img-src="https://lorempixel.com/600/300/food/5/"
                            img-alt="Image"
                            img-top 
                            tag="article"
                            class="mb-2">
                        <p class="card-text">
                        Some quick example text to build on the card title and make up the bulk of the card's content.
                        </p>
                        <b-button href="#" variant="primary">Go somewhere</b-button>
                    </b-card>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <!--<sensor-history-plot />-->
                    <!--<moving-time-series-plot-example />-->
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="6">
                    <!--<c3-example />-->
                    <distribution-plot />
                </b-col>
                <b-col cols="6">
                    <c3-pie-example />
                </b-col>
            </b-row>
            <c3-pie-example-2 />
        </b-container>
        <div class="container-fluid">
            <div>
                Name: <input v-model="name" type="text">
                <hello-decorator :name="name" :initialEnthusiasm="5" />
            </div>
            <!--<axios-example />-->
            <!--<canvas-time-series-plot-example />-->
            <!--<sensor-history-plot />-->
            <!--<moving-time-series-plot-example />-->
        </div>
    </div>
    `,
    data: {
        name: "World"
    },
    components: {
        HelloDecorator,
        AxiosExample,
        CanvasTimeSeriesPlotExample,
        SensorHistoryPlot,
        MovingTimeSeriesPlotExample,
        BritechartsExample,
        C3Example,
        C3PieExample,
        C3PieExample2,
        DistributionPlot
    }
});

