import Vue from "vue";
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import HelloDecorator from "./components/HelloDecorator.vue";
import AxiosExample from "./components/AxiosExample.vue";
import CanvasTimeSeriesPlotExample from "./components/CanvasTimeSeriesPlotExample.vue";
import SensorHistoryPlot from "./components/SensorHistoryPlot.vue";
import MovingTimeSeriesPlotExample from "./components/MovingTimeSeriesPlotExample.vue";
import BritechartsExample from "./components/BritechartsExample.vue";
import C3Example from "./components/C3Example.vue";
import C3PieExample from "./components/C3PieExample.vue";

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
                    <c3-example />
                </b-col>
                <b-col cols="6">
                    <c3-pie-example />
                </b-col>
            </b-row>
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
    data: { name: "World" },
    components: {
        HelloDecorator,
        AxiosExample,
        CanvasTimeSeriesPlotExample,
        SensorHistoryPlot,
        MovingTimeSeriesPlotExample,
        BritechartsExample,
        C3Example,
        C3PieExample
    }
});

