<template>
    <b-container class="">
        <b-row class="mb-4">
            <b-col>
                <trend-arrow :sensor="sensor" :timespan="trendLastHour" :auto-loading="autoLoading" />
            </b-col>
            <b-col>
                <trend-arrow :sensor="sensor" :timespan="trendLastDay" :auto-loading="autoLoading" />
            </b-col>
            <b-col>
                <trend-arrow :sensor="sensor" :timespan="trendLastWeek" :auto-loading="autoLoading" />
            </b-col>
        </b-row>
        <b-row class="mb-4">
            <b-col>
                <sensor-history-plot :sensor="sensor" :auto-loading="autoLoading" />
            </b-col>
        </b-row>
        <b-row class="mb-4">
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
import TrendArrow from "./TrendArrow.vue"
import { Timespan } from "./TrendArrow.vue"

import Examples from "./Examples.vue"

@Component({
    components: {
        SensorHistoryPlot,
        CompositionPieChart,
        DistributionPlot,
        TrendArrow
    }
})
export default class App extends Vue {

    @Prop({ required: true }) sensor!: Sensor

    @Prop() autoLoading: Boolean = true

    readonly trendLastHour = Timespan.LastHour
    readonly trendLastDay = Timespan.LastDay
    readonly trendLastWeek = Timespan.LastWeek

}
</script>

<style scoped>

</style>