<template>
    <div>
        Chart
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { ExamplePlot } from "../example"; //TODO remove
// @ts-ignore
import { CanvasTimeSeriesPlot } from '../globals.js';
declare var d3: any;
//import * as D3 from 'd3';
//import '../canvasplot.js';
//declare var CanvasTimeSeriesPlot: any; 

@Component
export default class CanvasPlotExample extends Vue {
    
    mounted() {
        console.log(this.$el);
        console.log(d3.select("#plot"));
        
        let container = d3.select(this.$el);
        var ts1 = [];
        var ts2 = [];
        var now = new Date();
        for(var i=0; i<3*48; ++i) {
            var time = new Date(now.getTime());
            time.setHours(i);
            ts1.push([time, Math.sin(Math.PI * i/48) + 0.2*(Math.random()-0.5)]);
            ts2.push([time, Math.cos(Math.PI * i/48) + 0.2*(Math.random()-0.5)]);
        }
        var tsPlot = new CanvasTimeSeriesPlot(container, [750,400], {
            yAxisLabel: "Voltage [V]"
        });
        tsPlot.addDataSet("ds1", "Signal 1", ts1, "orange", false);
        tsPlot.addDataSet("ds2", "Signal 2", ts2, "steelblue", true);
        tsPlot.setZoomYAxis(false);
    }
}
</script>

<style>
</style>