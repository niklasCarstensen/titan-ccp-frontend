<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">New Pie Charts &#128526; [WIP]</h5>
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
export default class NiklasModPieChart extends Vue {
  @Prop({ required: true }) sensor!: AggregatedSensor;

  private isLoading = false;
  private isError = false;

  private chart!: ChartAPI;

  mounted() {
    const width = 540;
    const height = 540;
    const radius = Math.min(width, height) / 2;
    const actualData = [
      ["Computing Center", 286],
      ["Computing Center 2", 256],
      ["Computing Center 3", 212]
    ];
    const data = [123, 125, 137, 135, 189, 123, 146, 146, 134, 124, 134];

    const svg = d3
      .select(this.$el)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

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

    const pie = d3
      .pie()
      .value((Math.PI * 2) / data.length)
      .sort(null);

    const maxData = data.reduce((x, y) => Math.max(x, y));
    const arc = d3.arc().innerRadius(0);
    var i = 0;
    arc.outerRadius(d => (data[i++] * height) / 2 / maxData);

    const path = svg.selectAll("path").data(pie(data));

    path
      .enter()
      .append("path")
      .attr("fill", (d, i) => color[i])
      .attr("d", <any>arc)
      .attr("stroke", "white")
      .attr("stroke-width", "2px");

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
