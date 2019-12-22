<template>
  <div class="card">
    <loading-spinner :is-loading="isLoading" :is-error="isError">
      <div class="d3-container"></div>
    </loading-spinner>
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
import ModPieChart from "./ModPieChart.vue";
import ChartDataLoader from "../ChartDataLoader";
import ChartChildDataLoader from "../ChartChildDataLoader";
import ChartTimeDataLoader from "../ChartTimeDataLoader";
import ChartColors from "../ChartColors";

@Component({
  components: {
    LoadingSpinner
  }
})
export default class ChartLegend extends Vue {
  @Prop({ required: true }) sensor!: AggregatedSensor;

  private isLoading = false;
  private isError = false;
  private loader = new ChartTimeDataLoader();

  private ledgend_svg: any;
  private width = 1200;
  private height = 50;
  private padding = 5;

  mounted() {
    console.log(ChartColors.get(0));

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
    const padding = this.padding;

    // Create ledgend svg
    var size = 20;
    const height =
      (1 +
        this.loader.data
          .map(x => x.children.length)
          .reduce((x, y) => Math.max(x, y))) *
        (size + this.padding) +
      40;
    const width = 20 + this.loader.data.length * 200 + size * 1.2;
    (this.$el.querySelector(".d3-container") as HTMLElement).setAttribute(
      "height",
      height.toString()
    );
    this.ledgend_svg = d3
      .select(this.$el.querySelector(".d3-container") as HTMLElement)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g");

    for (var j: number = 0; j < this.loader.data.length; j++) {
      // Add legend dots
      this.ledgend_svg
        .selectAll("mydots")
        .data(
          [this.loader.data[j].title].concat(
            this.loader.data[j].children.map(x => x.title)
          )
        )
        .enter()
        .append("rect")
        .attr("x", 20 + j * 200)
        .attr("y", function(d: any, i: number) {
          return 20 + i * (size + padding);
        })
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d: any, i: number) {
          return ChartColors.brighten(ChartColors.get(j), 1 + i * 0.2);
        });
      // Add legend labels
      this.ledgend_svg
        .selectAll("mylabels")
        .data(
          [this.loader.data[j].title].concat(
            this.loader.data[j].children.map(x => x.title)
          )
        )
        .enter()
        .append("text")
        .attr("x", 20 + j * 200 + size * 1.2)
        .attr("y", function(d: any, i: number) {
          return 20 + i * (size + padding) + size / 2;
        })
        .style("fill", function(d: any, i: number) {
          return ChartColors.brighten(ChartColors.get(j), 1 + i * 0.2);
        })
        .text(function(d: any, i: number) {
          return d;
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
    }
  }
}
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
}
.d3-container {
  overflow: auto;
}
</style>
