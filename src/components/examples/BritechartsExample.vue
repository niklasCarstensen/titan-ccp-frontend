<template>
    <div class="card britecharts-container">
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

//import {britecharts, LineChart, Line, xyz} from 'britecharts';
import LineChart from 'britecharts/dist/umd/line.min';
import Donut from 'britecharts/dist/umd/line.min';
import {selection, select} from 'd3-selection';
//d3Selection = require('d3-selection');


@Component
export default class BritechartsExample extends Vue {
    
    mounted() {
        console.log("he")
        console.log(selection);
        var container = select('.britecharts-container');
        console.log(container);
        console.log(LineChart);
        //console.log(LineChart);
        //console.log(Line);
        //console.log(xyz);
        console.log("ho")
        //console.log(rof);
        //console.log(jim);
       
       var container = select('.britecharts-container'),
            lineChart = new LineChart();

        if (container.node()) {
            lineChart
                .tooltipThreshold(20)
                .margin(5)
                .height(100)
                .width(200);
        }



        // This line gets together container, data and chart
        container.datum({
    dataByTopic: [
        {
            topicName: 'San Francisco',
            topic: 123,
            dates: [
                {
                    date: '2017-01-16T16:00:00-08:00',
                    value: 1
                },
                {
                    date: '2017-01-16T17:00:00-08:00',
                    value: 2
                }
            ]
        },
        {
            topicName: 'Other',
            topic: 345,
            dates: [
                {
                    date: '2017-01-18T16:00:00-08:00',
                    value: 3
                },
                {
                    date: '2017-01-18T17:00:00-08:00',
                    value: 4
                }
            ]
        }
    ]
}).call(lineChart);

    }


                



}
</script>

<style scoped>
    
</style>
