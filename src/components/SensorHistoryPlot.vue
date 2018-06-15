<template>
    <div class="card canvasplot-container">
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { HTTP } from "../http-common";
import { Sensor, AggregatedSensor } from '../SensorRegistry'
// @ts-ignore
import { CanvasTimeSeriesPlot } from '../canvasplot.js';
import { MovingTimeSeriesPlot, DataPoint } from '../MovingTimeSeriesPlot';

@Component
export default class SensorHistoryPlot extends Vue {
    
    private refreshIntervalInMs = 1000

    //private dataPoints = new Array<Array<any>>()
    @Prop({ required: true }) sensor!: Sensor

    // TODO
    //private latest = 0
    private latest = new Date().getTime() - (24 * 3600 * 1000)

    private plot!: MovingTimeSeriesPlot // Will definitely be assigned in mounted

    private intervalId?: number

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
        this.plot = new MovingTimeSeriesPlot(this.$el, {
            plotStartsWithZero: true,
        })
        // BETTER fetch already earlier and then wait for mount
        this.fetchNewData()
            .then(dataPoints => this.plot.setDataPoints(dataPoints))
            .then(() => {
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
            .catch(e => {
                console.error(e);
                return []
            });
    }

}
</script>

<style scoped>
    .canvasplot-container {
        height: 500px;
    }
</style>