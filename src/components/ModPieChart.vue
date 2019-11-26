<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">New Pie Chart &#128526; [WIP]</h5>
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

@Component({
  components: {
    LoadingSpinner
  }
})
export default class ModPieChart extends Vue {
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

    const pie_svg = d3
      .select(this.$el)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Create pie structure
    const pie = d3
      .pie()
      .value((Math.PI * 2) / data.length)
      .sort(null);

    // Set Radii
    const maxData = data.reduce((x, y) => Math.max(x, y));
    const arc = d3.arc().innerRadius(0);
    var i = 0;
    arc.outerRadius(d => (data[i++] * height) / 2 / maxData);

    // Draw pie
    const path = pie_svg.selectAll("path").data(pie(data));
    path
      .enter()
      .append("path")
      .attr("fill", (d, i) => color[i])
      .attr("d", <any>arc)
      .attr("stroke", "white")
      .attr("stroke-width", "2px");

    // Set Radii2
    const arc2 = d3.arc().innerRadius(0);
    var i = 0;
    arc2.outerRadius(d => ((data[i++] / 3) * 2 * height) / 2 / maxData);

    // Draw pie2
    path
      .enter()
      .append("path")
      .attr("fill", (d, i) => color[i + 1])
      .attr("d", <any>arc2)
      .attr("stroke", "white")
      .attr("stroke-width", "2px");

    // Create ledgend svg
    var size = 20;
    var padding = 5;
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
