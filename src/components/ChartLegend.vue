<template>
  <div class="card"></div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import {
  SensorRegistryRequester,
  AggregatedSensor,
  Sensor,
  SensorRegistry
} from "../SensorRegistry";
import { HTTP } from "../http-common";
import LoadingSpinner from "./LoadingSpinner.vue";
import { ChartAPI, generate } from "c3";
import "c3/c3.css";

import * as d3 from "d3";

function brighten(color: any, percent: any) {
  var r = parseInt(color.substr(1, 2), 16);
  var g = parseInt(color.substr(3, 2), 16);
  var b = parseInt(color.substr(5, 2), 16);

  return (
    "#" +
    Math.min(255, Math.floor(r * percent)).toString(16) +
    Math.min(255, Math.floor(g * percent)).toString(16) +
    Math.min(255, Math.floor(b * percent)).toString(16)
  );
}

@Component({
  components: {
    LoadingSpinner
  }
})
export default class ChartLegend extends Vue {
  @Prop({ required: true }) sensor!: AggregatedSensor;

  private isLoading = false;
  private isError = false;

  private width = 1200;
  private height = 200;
  private padding = 5;
  private color = [
    "#66c2FF",
    "#fc8d62",
    "#8da0cb",
    "#e78ac3",
    "#a6d854",
    "#ffd92f",
    "#66c2a5",
    "#fc8d62",
    "#8da0cb",
    "#e78ac3",
    "#a6d854",
    "#ffd92f"
  ];

  private inputData = [
    ["Computing Center", 166],
    ["Computing Center 2", 256],
    ["Computing Center 3", 302],
    ["Computing Center 4", 256],
    ["Computing Center 5", 292]
  ];

  private getData() {
    const reducedData = this.inputData.reduce(
      (memo, elem) => {
        memo.strings.push(elem[0] as string);
        memo.numbers.push(elem[1] as number);
        return memo;
      },
      {
        strings: [] as string[],
        numbers: [] as number[]
      }
    );
    return { data: reducedData.numbers, dataLabels: reducedData.strings };
  }

  mounted() {
    this.updateChart();
  }

  @Watch("sensor")
  onSensorChanged() {
    this.updateChart();
  }

  private updateChart() {
    const data = this.getData();
    const color = this.color;
    const padding = this.padding;

    // Create ledgend svg
    var size = 20;
    const ledgend_svg = d3
      .select(this.$el)
      .append("svg")
      .attr("width", this.width)
      .attr("height", data.dataLabels.length * (size + this.padding) + 40)
      .append("g");

    for (var j = 0; j < 3; j++) {
      // Add legend dots
      ledgend_svg
        .selectAll("mydots")
        .data(data.dataLabels)
        .enter()
        .append("rect")
        .attr("x", 100 + j * 300)
        .attr("y", function(d, i) {
          return 20 + i * (size + padding);
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d, i) {
          return brighten(color[<any>i], 1 + j * 0.2);
        });
      // Add legend labels
      ledgend_svg
        .selectAll("mylabels")
        .data(data.dataLabels)
        .enter()
        .append("text")
        .attr("x", 100 + j * 300 + size * 1.2)
        .attr("y", function(d, i) {
          return 20 + i * (size + padding) + size / 2;
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d, i) {
          return brighten(color[<any>i], 1 + j * 0.2);
        })
        .text(function(d) {
          return <any>d;
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
    }
  }
}
</script>