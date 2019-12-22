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
import ChartDataLoader from "../ChartDataLoader";
import ChartChildDataLoader from "../ChartChildDataLoader";
import ChartTimeDataLoader from "../ChartTimeDataLoader";
import ChartColors from "../ChartColors";

@Component({
  components: {
    LoadingSpinner
  }
})
export default class ModPieChart extends Vue {
  @Prop({ required: true }) sensor!: AggregatedSensor;

  private isLoading = false;
  private isError = false;
  private loader = new ChartTimeDataLoader();

  private pie_svg: any;

  private normalPieMode = false;
  private width = 540;
  private height = 540;
  private radius = Math.min(this.width, this.height) / 2;
  private padding = 15;
  private valueMappingFunction = Math.sqrt;

  range = (start: number, end: number, length = end - start) =>
    Array.from({ length }, (_, i) => start + i);

  async mounted() {
    // Create svg
    this.pie_svg = d3
      .select(this.$el)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`);

    await this.onSensorChanged();
  }

  @Watch("sensor")
  async onSensorChanged() {
    this.isLoading = true;

    this.isError = await this.loader.getAPIData(this.sensor);
    this.updateChart();

    this.isLoading = false;
  }

  private updateChart() {
    if (this.isError) {
      console.log("ModPie Data Error!");
      return;
    }

    const dataNumbers = this.loader.data.map(x =>
      this.valueMappingFunction(x.value)
    );

    // Create pie structure
    let pie;
    if (this.normalPieMode)
      pie = d3
        .pie()
        .value(function(d) {
          return d.valueOf();
        })
        .sort(null);
    else
      pie = d3
        .pie()
        .value((Math.PI * 2) / this.loader.data.length) // all slice angles are the same if we are in mod mode
        .sort(null);

    const maxData = dataNumbers.reduce((x, y) => Math.max(x, y));
    const maxChildCount = this.loader.data
      .map(x => x.children.length)
      .reduce((x, y) => Math.max(x, y));
    // Set child value percentages
    this.loader.data.forEach(x => {
      const childValueSum =
        x.children.length == 0
          ? 0
          : x.children
              .map(x => this.valueMappingFunction(x.value))
              .reduce((x, y) => x + y);
      x.children.forEach(
        c =>
          (c.valuePercent = this.valueMappingFunction(c.value) / childValueSum)
      );
    });

    const path = this.pie_svg.selectAll("path").data(pie(dataNumbers));
    for (let j = 0; j < maxChildCount; j++) {
      this.drawPieLayer(
        this.loader.data.map(x =>
          this.normalPieMode
            ? x.drawCurRadius
            : (x.drawCurRadius * this.valueMappingFunction(x.value)) / maxData
        ),
        path,
        this.range(0, this.loader.data.length).map(i =>
          ChartColors.brighten(ChartColors.get(i), 1.2 + j * 0.2)
        )
      );
      for (let i = 0; i < this.loader.data.length; i++) {
        this.loader.data[i].drawCurRadius =
          this.loader.data[i].children.length > j
            ? this.loader.data[i].drawCurRadius -
              this.loader.data[i].children[j].valuePercent
            : 0;
      }
    }
  }
  private drawPieLayer(Radii: number[], path: any, color: any) {
    // Set Radii
    const arc = d3.arc().innerRadius(0);
    var i = 0;
    arc.outerRadius(d => (Radii[i++] * (this.height - this.padding * 2)) / 2);

    // Draw pie
    path
      .enter()
      .append("path")
      .attr("class", "slice")
      .attr("fill", (d: any, i: number) => color[i])
      .attr("d", arc)
      .attr("stroke", "white")
      .attr("stroke-width", "2px")
      .append("title")
      .text((d: any) => d.data)
      .exit();
  }
}
</script>