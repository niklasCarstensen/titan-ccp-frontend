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
    
    private refreshIntervalinMs = 2000

    //private dataPoints = new Array<Array<any>>()
    @Prop({ required: true }) sensor!: Sensor

    private latest = 0

    private plot!: MovingTimeSeriesPlot // Will definitely assigned in mounted

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
        this.plot = new MovingTimeSeriesPlot(this.$el)
        // BETTER fetch already earlier and then wait for mount
        this.fetchNewData().then(dataPoints => this.plot.setDataPoints(dataPoints))

        this.intervalId = setInterval(() => {
            this.fetchNewData().then(dataPoints => this.plot.addDataPoints(dataPoints))     
        }, this.refreshIntervalinMs)
    }

    private destroyPlot() {
        if (this.intervalId) {
            clearInterval(this.intervalId)
        }
        this.latest = 0
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
                return response.data.map((x: any) => new DataPoint(new Date(x.timestamp), this.sensor instanceof AggregatedSensor ? x.sum : x.powerConsumptionInWh));
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