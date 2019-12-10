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

  private svg: any;

  private width = 540;
  private height = 540;
  private radius = Math.min(this.width, this.height) / 2;
  private padding = 15;
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
    // Add chart svg
    this.svg = d3
      .select(this.$el)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g");

    this.updateChart();
  }

  @Watch("sensor")
  onSensorChanged() {
    this.updateChart();
  }

  private updateChart() {
    const data = this.getData();

    var sum = data.data.reduce((x, y) => Number(x) + Number(y));
    var curY = 0;
    var i = 0;
    for (var i = 0; i < data.data.length; i++) {
      var curHeight = (data.data[i] * (this.height - this.padding * 2)) / sum;

      var curX = 0;
      for (var j = 0; j < 3; j++) {
        var curWidth = (this.width - this.padding * 2) / 3;

        this.svg
          .append("rect")
          .attr("x", this.padding + curX)
          .attr("y", this.padding + curY)
          .attr("width", curWidth)
          .attr("height", curHeight)
          .attr("fill", brighten(this.color[i], 1 + j * 0.2))
          .attr("stroke", "white")
          .attr("stroke-width", "2px");

        curX += curWidth;
      }

      curY += curHeight;
    }
  }
}
</script>
