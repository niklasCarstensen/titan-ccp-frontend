<template>
  <div class="card">
    <div class="card-body">
      <b-row>
        <b-col cols="9">
          <h5 class="card-title">New Pie Chart &#128526; [WIP]</h5>
        </b-col>
        <b-col cols="3">
          <b-form-select
            v-if="selectedInterval"
            v-model="selectedInterval"
            :options="intervalSelectOptions"
            class="mb-3"
          ></b-form-select>
        </b-col>
      </b-row>
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
import { DateTime, Interval } from "luxon";
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

  private availableIntervals: Interval[] = [];
  private selectedInterval: Interval | null = null;

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

    const path = this.pie_svg
      .selectAll("path")
      .data(pie(dataNumbers))
      .enter();
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
        ),
        pie,
        (Math.PI * 2) / this.loader.data.length
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
  private drawPieLayer(
    Radii: number[],
    path: any,
    color: any,
    pie: any,
    angle: any
  ) {
    const t = this;

    // Set Radii
    var i = 0;
    const pathArc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(d => (Radii[i++] * (this.height - this.padding * 2)) / 2)
      .startAngle((d, i) => i * angle)
      .endAngle((d, i) => (i + 1) * angle);

    // Draw pie
    const sliceG = path.append("g");
    const pathPath = sliceG
      .append("path")
      .attr("class", "slice")
      .attr("fill", (d: any, i: number) => color[i])
      .attr("d", pathArc)
      .attr("stroke", "white")
      .attr("stroke-width", "2px");

    sliceG
      .append("text")
      .attr("transform", function(d: any, i: any) {
        if (Radii[i] > 0.7)
          return (
            "translate(" +
            (Math.cos((i + 1 / 2) * angle - Math.PI / 2) *
              Radii[i] *
              (t.height - t.padding * 2)) /
              2.2 +
            "," +
            (Math.sin((i + 1 / 2) * angle - Math.PI / 2) *
              Radii[i] *
              (t.height - t.padding * 2)) /
              2.2 +
            ")"
          );
        else return "translate(-50000,0)";
      })
      .attr("dy", ".50em")
      .style("text-anchor", "middle")
      .text(function(d: any, i: any) {
        return t.loader.data[i].title;
      });

    pathPath.append("title").text((d: any) => d.data);
    pathPath.selectAll("path").sty;
  }
}
</script>