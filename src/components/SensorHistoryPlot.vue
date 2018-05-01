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
    
    private dataPoints = new Array<Array<any>>()

    created() {
        let identifier = "root"
        HTTP.get('aggregated-power-consumption/' + identifier)
        .then(response => {
            // JSON responses are automatically parsed.
            //console.log(response.data);
            for (let dataPoint of response.data) {
                this.dataPoints.push([new Date(dataPoint.timestamp), dataPoint.sum])
            }
            //console.log(this.dataPoints)
        })
        .catch(e => {
            console.error(e);
        });
    }

    mounted() {
        let plot = new MovingTimeSeriesPlot(this.$el);

        var last = Math.random() * 100

        let ts2 = new Array<DataPoint>();
        ts2.push(new DataPoint(new Date(), last));
        plot.setDataPoints(ts2);

        setInterval(() => {
            let dps = new Array<DataPoint>()
            let newValue = last + (Math.random() * 10) - 5            
            dps.push(new DataPoint(new Date(), newValue))
            plot.addDataPoints(dps)
            last = newValue
        }, 500);


        /*
        let container = d3.select(this.$el);
        let width = this.$el.clientWidth;
        let height = this.$el.clientHeight;
        var tsPlot = new CanvasTimeSeriesPlot(container, [width, height], {
            yAxisLabel: "Voltage [V]"
        });
        tsPlot.setZoomYAxis(false);

        let ts2 = [];
        let now = new Date();
        for(var i=0; i<3*48; ++i) {
            let time = new Date(now.getTime());
            time.setHours(i);
            ts2.push([time, Math.cos(Math.PI * i/48) + 0.2*(Math.random()-0.5)]);
        }
        tsPlot.addDataSet("ds2", "Signal 2", ts2, "steelblue", true, false);
        */
    }

    private fetchNewData() {
        let identifier = "root" //TODO property
        let x = HTTP.get('aggregated-power-consumption/' + identifier)
        .then(response => {
            // JSON responses are automatically parsed.
            console.log(response.data);
            for (let dataPoint of response.data) {
                this.dataPoints.push([new Date(dataPoint.timestamp), dataPoint.sum])
            }
            console.log(this.dataPoints)
        })
        .catch(e => {
            console.error(e);
        });
    }
}
</script>

<style scoped>
    .canvasplot-container {
        height: 500px;
    }
</style>