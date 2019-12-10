<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">New Time Stack Chart &#128526; [WIP]</h5>
      <loading-spinner :is-loading="isLoading" :is-error="isError"></loading-spinner>
    </div>
  </div>
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
export default class TimeStackChart extends Vue {
  @Prop({ required: true }) sensor!: AggregatedSensor;

  private isLoading = false;
  private isError = false;

  private chart!: ChartAPI;

  mounted() {
    const width = 540;
    const height = 540;
    const radius = Math.min(width, height) / 2;
    const inputData = [
      ["Computing Center", 166],
      ["Computing Center 2", 256],
      ["Computing Center 3", 302],
      ["Computing Center 4", 256],
      ["Computing Center 5", 292]
    ];
    const reducedData = inputData.reduce(
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
    const data = reducedData.numbers;
    const data_labels = reducedData.strings;

    const color = [
      "#66c2a5",
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

    var padding = 5;

    // TODO: Add chart
    const svg = d3
      .select(this.$el)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g");

    var sum = data.reduce((x, y) => Number(x) + Number(y));
    var curY = 0;
    var i = 0;
    for (var i = 0; i < data.length; i++) {
      var curHeight = (data[i] * height) / sum;

      var curX = 0;
      for (var j = 0; j < 3; j++) {
        var curWidth = (width - padding * 2) / 3;

        svg
          .append("rect")
          .attr("x", padding + curX)
          .attr("y", padding + curY)
          .attr("width", curWidth)
          .attr("height", curHeight)
          .attr("fill", brighten(color[i], 1 + j * 0.2))
          .attr("stroke", "white")
          .attr("stroke-width", "2px");

        curX += curWidth;
      }

      curY += curHeight;
    }

    // Create ledgend svg
    var size = 20;
    const ledgend_svg = d3
      .select(this.$el)
      .append("svg")
      .attr("width", width)
      .attr("height", data_labels.length * (size + padding) + 40)
      .append("g");
    console.log(data_labels.length * (size * padding) + 20);

    // Add legend dots
    ledgend_svg
      .selectAll("mydots")
      .data(data_labels)
      .enter()
      .append("rect")
      .attr("x", 100)
      .attr("y", function(d, i) {
        return 20 + i * (size + padding);
      }) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("width", size)
      .attr("height", size)
      .style("fill", function(d, i) {
        return color[<any>i];
      });
    // Add legend labels
    ledgend_svg
      .selectAll("mylabels")
      .data(data_labels)
      .enter()
      .append("text")
      .attr("x", 100 + size * 1.2)
      .attr("y", function(d, i) {
        return 20 + i * (size + padding) + size / 2;
      }) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", function(d, i) {
        return color[<any>i];
      })
      .text(function(d) {
        return <any>d;
      })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle");

    this.updateChart();
  }

  @Watch("sensor")
  onSensorChanged() {
    this.updateChart();
  }

  private updateChart() {}
}
</script>

<style scoped>
.-container {
  height: 300px;
}
</style>
