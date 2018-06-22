<template>
    <b-container class="">
        <comparison-plot v-for="plot in plots" :key="plot"
            :domainX="domainX"
            :colors="colorRepository"
            @remove="removePlot(plot)"
            @update-domain-x="updateDomainX"
            />
        <b-row>
            <button @click="addPlot">Add Plot</button>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator"
import { Sensor, AggregatedSensor, MachineSensor, SensorRegistry } from '../SensorRegistry'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import ComparisonPlot from './ComparisonPlot.vue';
import ColorRepository from "../ColorRepository";

@Component({
    components: {
        ComparisonPlot
    }
})
export default class Comparision extends Vue {

    private plots = new Array<number>()

    private nextPlotId = 0

    colorRepository = new ColorRepository()

    domainX = new Array<Date>()

    addPlot() {
        this.plots.push(this.nextPlotId)
        this.nextPlotId++
    }

    removePlot(plot: number) {
        this.plots.splice(this.plots.indexOf(plot), 1)
    }

    updateDomainX(domainX?: Array<Date>) {
        if (domainX) {
            this.domainX = domainX
            //console.log(this.domainX)
        }
    }

}

class Plot {

    readonly dataSets = new Array<DataSet>()

    newDataSet = ""

    constructor (readonly id: number) {}
}

class DataSet {

    constructor (readonly sensor: string) {}

}

</script>

<style scoped>

</style>