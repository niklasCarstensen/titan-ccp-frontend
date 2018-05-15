<template>
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
            <b-row>
                <b-col>
                    <composition-pie-chart :sensor-registry="sensorRegistry" />
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <pre>{{ sensorRegistryAsString }}</pre>
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
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import { SensorRegistryRequester } from '../SensorRegistry'

import DistributionPlot from "./DistributionPlot.vue";
import CompositionPieChart from "./CompositionPieChart.vue";
import SensorHistoryPlot from "./SensorHistoryPlot.vue";

import HelloDecorator from "./examples/HelloDecorator.vue";
import AxiosExample from "./examples/AxiosExample.vue";
import CanvasTimeSeriesPlotExample from "./examples/CanvasTimeSeriesPlotExample.vue";
import MovingTimeSeriesPlotExample from "./examples/MovingTimeSeriesPlotExample.vue";
import BritechartsExample from "./examples/BritechartsExample.vue";
import C3Example from "./examples/C3Example.vue";
import C3PieExample from "./examples/C3PieExample.vue";

@Component({
    components: {
        SensorHistoryPlot,
        CompositionPieChart,
        DistributionPlot,

        HelloDecorator,
        AxiosExample,
        CanvasTimeSeriesPlotExample,
        MovingTimeSeriesPlotExample,
        BritechartsExample,
        C3Example,
        C3PieExample
    }
})
export default class App extends Vue {

    readonly name = "World"

    private sensorRegistry = new SensorRegistryRequester().request()
    private sensorRegistryAsString = ""

    created() {
        this.sensorRegistry.then(registry => {
            this.sensorRegistryAsString = JSON.stringify(registry, null, '\t')
        })
    }

}
</script>

<style scoped>

</style>