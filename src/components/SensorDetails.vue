<template>
    <div>
        <b-container>
            <b-row class="mb-4">
                <b-col :cols="isAggregated ? 10 : 12">
                    <sensor-parents :sensor="sensor" v-on:select="setSensor"/>
                </b-col>
                <b-col v-if="isAggregated" cols ="2">
                    <b-dropdown right text="Children" variant="secondary" size="lg" block class="children-dropdown">
                        <b-dropdown-item v-for="child in sensor.children" :key="child.identifier" v-on:click="sensor = child">
                                {{ child.title }}
                        </b-dropdown-item>
                    </b-dropdown>
                </b-col>
            </b-row>
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
                <b-col v-if="isAggregated" cols="6">
                    <composition-pie-chart :sensor="sensor" />
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator"
import { Sensor, AggregatedSensor, MachineSensor, SensorRegistry } from '../SensorRegistry'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import SensorParents from "./SensorParents.vue"
import DistributionPlot from "./DistributionPlot.vue"
import CompositionPieChart from "./CompositionPieChart.vue"
import SensorHistoryPlot from "./SensorHistoryPlot.vue"
import TrendArrow from "./TrendArrow.vue"
import { Timespan } from "./TrendArrow.vue"


@Component({
    components: {
        SensorParents,
        SensorHistoryPlot,
        CompositionPieChart,
        DistributionPlot,
        TrendArrow
    }
})
export default class SensorDetails extends Vue {

    @Prop({ required: true }) sensor!: Sensor

    @Prop() autoLoading: Boolean = true

    readonly trendLastHour = Timespan.LastHour
    readonly trendLastDay = Timespan.LastDay
    readonly trendLastWeek = Timespan.LastWeek

    get isAggregated() {
        return this.sensor instanceof AggregatedSensor
    }

    setSensor(sensor: Sensor) {
        this.sensor = sensor
    }

}
</script>

<style scoped>
    
    .children-dropdown {
        width: 100%;
    }
</style>

<style>
    /* Hack */
    .children-dropdown button {
        display: block;
        width: 100%;
        padding: 0.68rem 1rem;
        font-size: 1rem;
    }
</style>