<template>
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">Active Power Consumption</h5>
            <loading-spinner :is-loading="isLoading" :is-error="isError">
                <div class="canvasplot-container"></div>
            </loading-spinner>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { HTTP } from "../http-common";
import { Sensor, AggregatedSensor } from '../SensorRegistry'
import LoadingSpinner from "./LoadingSpinner.vue"
// @ts-ignore
import { CanvasTimeSeriesPlot } from '../canvasplot.js';
import { MovingTimeSeriesPlot, DataPoint } from '../MovingTimeSeriesPlot';

@Component({
    components: {
        LoadingSpinner
    }
})
export default class SensorHistoryPlot extends Vue {
    
    private refreshIntervalInMs = 1000

    //private dataPoints = new Array<Array<any>>()
    @Prop({ required: true }) sensor!: Sensor

    // TODO
    //private latest = 0
    private latest = new Date().getTime() - (3600 * 1000)

    private isLoading = false
    private isError = false

    private plot!: MovingTimeSeriesPlot // Will definitely be assigned in mounted

    private intervalId?: number

    get canvasplotContainer() {
        return this.$el.querySelector(".canvasplot-container")! as HTMLElement
    }

    created() {
    }

    mounted() {
        this.createPlot()
    }

    destroyed() {
        if (this.intervalId) {
            clearInterval(this.intervalId)
        }
    }

    @Watch('sensor')
    onSensorChanged(sensor: Sensor) {
        this.destroyPlot()
        this.createPlot()
    }

    private createPlot() {
        this.plot = new MovingTimeSeriesPlot(this.canvasplotContainer, {
            plotStartsWithZero: true,
            yAxisLabel: "Active Power in Watt"
        })
        // BETTER fetch already earlier and then wait for mount
        this.isLoading = true
        this.fetchNewData()
            .catch(e => {
                console.error(e);
                this.isError = true
                return []
            })
            .then(dataPoints => {
                this.isLoading = false
                this.plot.setDataPoints(dataPoints)
            }).then(() => {
                this.intervalId = setInterval(() => {
                    this.fetchNewData().then(dataPoints => this.plot.addDataPoints(dataPoints))     
                }, this.refreshIntervalInMs)
            })
        
    }

    private destroyPlot() {
        if (this.intervalId) {
            clearInterval(this.intervalId)
        }
        // TODO
        //this.latest = 0
        this.latest = new Date().getTime() - (3600 * 1000)
        this.plot.destroy()
    }

    private fetchNewData(): Promise<DataPoint[]> {   
        let resource = this.sensor instanceof AggregatedSensor ? 'aggregated-power-consumption' : 'power-consumption' 
        return HTTP.get(resource + '/' + this.sensor.identifier + '?after=' + this.latest)
            .then(response => {
                // JSON responses are automatically parsed.
                if (response.data.length > 0) {
                    this.latest = response.data[response.data.length - 1].timestamp
                }
                // TODO access sum generically
                return response.data.map((x: any) => new DataPoint(new Date(x.timestamp), this.sensor instanceof AggregatedSensor ? x.sumInW : x.valueInW));
            })
    }

}
</script>

<style scoped>
    .canvasplot-container {
        height: 400px;
    }
</style>