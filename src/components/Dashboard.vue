<template>
    <b-container class="">
        <b-row>
            <b-col>
                <sensor-history-plot :sensor="sensor" />
            </b-col>
        </b-row>
        <b-row>
            <b-col cols="6">
                <distribution-plot :sensor="sensor" />
            </b-col>
            <b-col cols="6">
                <composition-pie-chart :sensor="sensor" />
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator"
import { Sensor, AggregatedSensor, MachineSensor, SensorRegistry } from '../SensorRegistry'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import { SensorRegistryRequester } from '../SensorRegistry'

import SensorDetails from "./SensorDetails.vue"

import DistributionPlot from "./DistributionPlot.vue"
import CompositionPieChart from "./CompositionPieChart.vue"
import SensorHistoryPlot from "./SensorHistoryPlot.vue"

import Examples from "./Examples.vue"

@Component({
    components: {
        SensorHistoryPlot,
        CompositionPieChart,
        DistributionPlot,
    }
})
export default class App extends Vue {

    @Prop({ required: true }) sensor!: Sensor

}
</script>

<style scoped>

</style>