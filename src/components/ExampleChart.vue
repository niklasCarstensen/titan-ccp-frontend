<template>
    <div>
        Chart
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { greeter } from "../example";
//import * as D3 from 'd3';
//import '../canvasplot.js';
//declare var CanvasTimeSeriesPlot: any; 

@Component
export default class ExampleChart extends Vue {
    
    mounted() {
        greeter();

        let ts1 = [];
        let ts2 = [];
        let now = new Date();
        for(var i=0; i<3*48; ++i) {
            let time = new Date(now.getTime());
            time.setHours(i);
            ts1.push([time, Math.sin(Math.PI * i/48) + 0.2*(Math.random()-0.5)]);
            ts2.push([time, Math.cos(Math.PI * i/48) + 0.2*(Math.random()-0.5)]);
        }
        //hey();
        //D3.select("#plotcontainerTSPlot")
        /*
        var tsPlot = new CanvasTimeSeriesPlot(D3.select("#plotcontainerTSPlot"), [750,400], {
            yAxisLabel: "Voltage [V]"
        });
        
        
        tsPlot.addDataSet("ds1", "Signal 1", ts1, "orange", false);
        tsPlot.addDataSet("ds2", "Signal 2", ts2, "steelblue", true);
        tsPlot.setZoomYAxis(false);
        */
        }
}
</script>

<style>
</style>