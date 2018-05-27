<template>
    <div>
        <b-container class="">
            <b-row>
                <b-col>
                    <sensor-parents :sensor="sensor" v-on:select="setSensor"/>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <sensor-history-plot :sensor="sensor" />
                </b-col>
            </b-row>
            <b-row v-if="isAggregated">
                <b-col cols="6">
                    <composition-pie-chart :sensor="sensor" />
                </b-col>
                <b-col cols="6">
                    <b-list-group>
                        <b-list-group-item href="#" v-for="child in sensor.children" :key="child.identifier" v-on:click="sensor = child" >
                            {{ child.identifier}}
                        </b-list-group-item>
                    </b-list-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="6">
                    <distribution-plot :sensor="sensor" />
                </b-col>
                <b-col cols="6">
                    
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


@Component({
    components: {
        SensorParents,
        SensorHistoryPlot,
        CompositionPieChart,
        DistributionPlot,
    }
})
export default class SensorDetails extends Vue {

    @Prop({ required: true }) sensor!: Sensor

    get isAggregated() {
        return this.sensor instanceof AggregatedSensor
    }

    setSensor(sensor: Sensor) {
        this.sensor = sensor
    }

}
</script>

<style scoped>

</style>