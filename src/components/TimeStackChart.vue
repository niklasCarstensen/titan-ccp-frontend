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
import ChartDataLoader from "../ChartDataLoader";
import ChartChildDataLoader from "../ChartChildDataLoader";
import ChartTimeDataLoader from "../ChartTimeDataLoader";
import ChartColors from "../ChartColors";

@Component({
  components: {
    LoadingSpinner
  }
})
export default class TimeStackChart extends Vue {
  @Prop({ required: true }) sensor!: AggregatedSensor;

  private isLoading = false;
  private isError = false;
  private loader = new ChartTimeDataLoader();

  private svg: any;

  private width = 540;
  private height = 540;
  private radius = Math.min(this.width, this.height) / 2;
  private padding = 15;

  mounted() {
    // Add chart svg
    this.svg = d3
      .select(this.$el)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g");

    this.onSensorChanged();
  }

  @Watch("sensor")
  async onSensorChanged() {
    this.isLoading = true;

    this.isError = await this.loader.getAPIData(this.sensor);
    this.updateChart();

    this.isLoading = false;
  }

  private updateChart() {
    var dataValueSum = this.loader.data
      .map(x => x.value)
      .reduce((x, y) => x + y);
    const maxChildCount = this.loader.data
      .map(x => x.children.length)
      .reduce((x, y) => Math.max(x, y));
    // Set child value percentages
    this.loader.data.forEach(x => {
      const childValueSum = x.children
        .map(x => x.value)
        .reduce((x, y) => x + y);
      x.children.forEach(c => (c.valuePercent = c.value / childValueSum));
    });

    var curY = 0;
    var i = 0;
    for (var i = 0; i < this.loader.data.length; i++) {
      var curHeight =
        (this.loader.data[i].value * (this.height - this.padding * 2)) /
        dataValueSum;

      var curX = 0;
      for (var j = 0; j < maxChildCount; j++) {
        var curWidth =
          (this.width - this.padding * 2) *
          (this.loader.data[i].children.length > j
            ? this.loader.data[i].children[j].valuePercent
            : 0);

        this.svg
          .append("rect")
          .attr("x", this.padding + curX)
          .attr("y", this.padding + curY)
          .attr("width", curWidth)
          .attr("height", curHeight)
          .attr("fill", ChartColors.brighten(ChartColors.get(i), 1.2 + j * 0.2))
          .attr("stroke", "white")
          .attr("stroke-width", "2px");

        curX += curWidth;
      }

      curY += curHeight;
    }
  }
}
</script>
