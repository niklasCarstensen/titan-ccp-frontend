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
export default class ChartLegend extends Vue {
  @Prop({ required: true }) sensor!: AggregatedSensor;

  private isLoading = false;
  private isError = false;

  private width = 1200;
  private height = 200;
  private padding = 5;
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
    this.onSensorChanged();
  }

  @Watch("sensor")
  onSensorChanged() {
    this.getAPIData(this.sensor, this.data);
  }

  private updateChart() {
    const color = this.color;
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
          this.data
            .map(x => x.children.length)
            .reduce((x, y) => Math.max(x, y))) *
          (size + this.padding) +
          40
      )
      .append("g");

    for (var j = 0; j < this.data.length; j++) {
      // Add legend dots
      ledgend_svg
        .selectAll("mydots")
        .data(
          [this.data[j].title].concat(this.data[j].children.map(x => x.title))
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
          return brighten(color[<any>j], 1 + i * 0.2);
        });
      // Add legend labels
      ledgend_svg
        .selectAll("mylabels")
        .data(
          [this.data[j].title].concat(this.data[j].children.map(x => x.title))
        )
        .enter()
        .append("text")
        .attr("x", 20 + j * 200 + size * 1.2)
        .attr("y", function(d, i) {
          return 20 + i * (size + padding) + size / 2;
        })
        .style("fill", function(d, i) {
          return brighten(color[<any>j], 1 + i * 0.2);
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