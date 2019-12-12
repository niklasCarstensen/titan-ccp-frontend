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

  private data = [
    {
      identifier: "",
      title: "",
      value: 0,
      drawCurRadius: 0,
      children: [
        {
          identifier: "",
          title: "",
          value: 0,
          valuePercent: 0
        }
      ]
    }
  ];

  public getAPIData(
    sensor: AggregatedSensor,
    data: {
      identifier: string;
      title: string;
      value: number;
      drawCurRadius: number;
      children: {
        identifier: string;
        title: string;
        value: number;
        valuePercent: number;
      }[];
    }[]
  ) {
    const sens = sensor.children.concat(
      sensor.children
        .filter(x => x instanceof AggregatedSensor)
        .map(x => (x as AggregatedSensor).children)
        .reduce((x, y) => x.concat(y))
    );
    Promise.all(sens.map(s => this.addToDataList(data, s)))
      .catch(e => {
        console.error(e);
        this.isError = true;
      })
      .then(x => {
        // Remove sample element
        data.shift();

        this.updateChart();
      });
  }
  private addToDataList(
    data: {
      identifier: string;
      title: string;
      value: number;
      drawCurRadius: number;
      children: {
        identifier: string;
        title: string;
        value: number;
        valuePercent: number;
      }[];
    }[],
    child: Sensor
  ) {
    let resource =
      child instanceof AggregatedSensor
        ? "aggregated-power-consumption"
        : "power-consumption";
    return HTTP.get(resource + "/" + child.identifier + "/latest").then(
      response => {
        // JSON responses are automatically parsed.
        let value;
        if (response.data.length <= 0) {
          value = 0;
        } else if (child instanceof AggregatedSensor) {
          value = response.data[0].sumInW;
        } else {
          value = response.data[0].valueInW;
        }

        if (child.parent !== undefined) {
          if (child.parent.identifier === "root") {
            data.push({
              identifier: child.identifier,
              title: child.title,
              value: value,
              drawCurRadius: 1,
              children: []
            });
          } else {
            const par = data.find(
              x =>
                child.parent !== undefined &&
                x.identifier == child.parent.identifier
            );
            if (par !== undefined) {
              par.children.push({
                identifier: child.identifier,
                title: child.title,
                value: value,
                valuePercent: 0
              });
            } else {
              console.log("Lost child!" + child.identifier);
            }
          }
        }
      }
    );
  }

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
  onSensorChanged() {
    this.getAPIData(this.sensor, this.data);
  }

  private updateChart() {
    var dataValueSum = this.data.map(x => x.value).reduce((x, y) => x + y);
    const maxChildCount = this.data
      .map(x => x.children.length)
      .reduce((x, y) => Math.max(x, y));
    // Set child value percentages
    this.data.forEach(x => {
      const childValueSum = x.children
        .map(x => x.value)
        .reduce((x, y) => x + y);
      x.children.forEach(c => (c.valuePercent = c.value / childValueSum));
    });

    var curY = 0;
    var i = 0;
    for (var i = 0; i < this.data.length; i++) {
      var curHeight =
        (this.data[i].value * (this.height - this.padding * 2)) / dataValueSum;

      var curX = 0;
      for (var j = 0; j < maxChildCount; j++) {
        var curWidth =
          (this.width - this.padding * 2) *
          (this.data[i].children.length > j
            ? this.data[i].children[j].valuePercent
            : 0);

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
