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
    
    //private dataPoints = new Array<Array<any>>()
    @Prop({ required: true }) sensor!: Sensor
    private latest = 0

    private intervalId?: number

    created() {
    }

    mounted() {
        //TODO Handle sensor changed
        let plot = new MovingTimeSeriesPlot(this.$el);

        // TODO fetch already earlier and then wait for mount
        this.fetchNewData().then(dataPoints => plot.setDataPoints(dataPoints))

        this.intervalId = setInterval(() => {
            this.fetchNewData().then(dataPoints => plot.addDataPoints(dataPoints))     
        }, 500)
    }

    destroyed() {
        if (this.intervalId) {
            clearInterval(this.intervalId)
        }
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