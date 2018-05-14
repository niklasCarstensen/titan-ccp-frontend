<template>
    <div class="card canvasplot-container">
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { HTTP } from "../http-common";
// @ts-ignore
import { CanvasTimeSeriesPlot } from '../canvasplot.js';
import { MovingTimeSeriesPlot, DataPoint } from '../MovingTimeSeriesPlot';
declare var d3: any;

@Component
export default class SensorHistoryPlot extends Vue {
    
    //private dataPoints = new Array<Array<any>>()
    private identifier = "root" //TODO property
    private latest = 0

    created() {

    }

    mounted() {
        let plot = new MovingTimeSeriesPlot(this.$el);

        // TODO fetch already earlier and then wait for mount
        this.fetchNewData().then(dataPoints => plot.setDataPoints(dataPoints))

        setInterval(() => {
            this.fetchNewData().then(dataPoints => plot.addDataPoints(dataPoints))     
        }, 500);

    }

    private fetchNewData(): Promise<DataPoint[]> {   
        return HTTP.get('aggregated-power-consumption/' + this.identifier + '?after=' + this.latest)
        .then(response => {
            console.log(response.data)
            // JSON responses are automatically parsed.
            if (response.data.length > 0) {
                this.latest = response.data[response.data.length - 1].timestamp
            }
            // TODO access sum generically
            return response.data.map((x: any) => new DataPoint(new Date(x.timestamp), x.sum));
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