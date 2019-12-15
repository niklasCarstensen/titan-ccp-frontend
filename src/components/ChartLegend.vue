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
import ModPieChart from "./ModPieChart.vue";
import ChartDataLoader from "../ChartDataLoader";
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
  private loader = new ChartDataLoader();

  private width = 1200;
  private height = 200;
  private padding = 5;

  mounted() {
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
    const color = ChartColors.color;
    const padding = this.padding;

    // Create ledgend svg
    var size = 20;
    const ledgend_svg = d3
      .select(this.$el)
      .append("svg")
      .attr("width", this.width)
      .attr(
        "height",
        (1 +
          this.loader.data
            .map(x => x.children.length)
            .reduce((x, y) => Math.max(x, y))) *
          (size + this.padding) +
          40
      )
      .append("g");

    for (var j = 0; j < this.loader.data.length; j++) {
      // Add legend dots
      ledgend_svg
        .selectAll("mydots")
        .data(
          [this.loader.data[j].title].concat(
            this.loader.data[j].children.map(x => x.title)
          )
        )
        .enter()
        .append("rect")
        .attr("x", 20 + j * 200)
        .attr("y", function(d, i) {
          return 20 + i * (size + padding);
        })
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d, i) {
          return ChartColors.brighten(color[<any>j], 1 + i * 0.2);
        });
      // Add legend labels
      ledgend_svg
        .selectAll("mylabels")
        .data(
          [this.loader.data[j].title].concat(
            this.loader.data[j].children.map(x => x.title)
          )
        )
        .enter()
        .append("text")
        .attr("x", 20 + j * 200 + size * 1.2)
        .attr("y", function(d, i) {
          return 20 + i * (size + padding) + size / 2;
        })
        .style("fill", function(d, i) {
          return ChartColors.brighten(color[<any>j], 1 + i * 0.2);
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