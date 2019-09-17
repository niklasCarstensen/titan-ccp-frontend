<template>
  <div class="card">
    <div class="card-body">
      <div class="space-between">
        <h5 class="card-title">{{ statsType.title }}</h5>
        <b-dropdown text="Choose Interval" class="m-md-2">
          <b-dropdown-item
            @click="createPlot(interval.start.seconds * 1000, interval.end.seconds * 1000)"
            v-for="interval in intervals"
            :key="interval.start.seconds"
          >{{getIntervalString(interval)}}</b-dropdown-item>
        </b-dropdown>
      </div>
      <loading-spinner :is-loading="isLoading" :is-error="isError">
        <div class="c3-container"></div>
      </loading-spinner>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import LoadingSpinner from "./LoadingSpinner.vue";
import { HTTP } from "../http-common";
import { Sensor, AggregatedSensor } from "../SensorRegistry";
import { ChartAPI, generate } from "c3";
import "c3/c3.css";
import { DateTime } from "luxon";

@Component({
  components: {
    LoadingSpinner
  }
})
export default class StatsPlot extends Vue {
  @Prop({ required: true }) sensor!: Sensor;

  @Prop({ required: true }) statsType!: StatsType;

  private chart!: ChartAPI;

  private isLoading = true;
  private isError = false;

  private intervals: any = [];

  mounted() {
    this.chart = generate({
      bindto: this.$el.querySelector(".c3-container") as HTMLElement,
      data: {
        x: "x",
        columns: [],
        type: "spline"
      },
      legend: {
        show: false
      },
      axis: {
        x: {
          type: "category"
        },
        y: {
          min: 0
        }
      },
      grid: {
        x: {
          show: true
        },
        y: {
          show: true
        }
      },
      tooltip: {
        show: false
      }
    });
    this.getIntervals();
    this.createPlot();
  }

  getIntervalString(interval: any) {
    const start = DateTime.fromMillis(interval.start.seconds * 1000);
    const end = DateTime.fromMillis(interval.end.seconds * 1000);

    return start.toFormat("yyyy/MM/dd") + " - " + end.toFormat("yyyy/MM/dd");
  }

  @Watch("sensor")
  onSensorChanged(sensor: Sensor) {
    this.createPlot();
  }

  private getIntervals() {
    HTTP.get(`/stats/interval/${this.statsType.url}`).then(response => {
      this.intervals = response.data;
    });
  }

  private createPlot(start?: number, end?: number) {
    let url =
      start != undefined && end != undefined
        ? `/stats/sensor/${this.sensor.identifier}/${this.statsType.url}?start=${start}&end=${end}`
        : `/stats/sensor/${this.sensor.identifier}/${this.statsType.url}`;

    HTTP.get(url)
      .then(response => {
        // JSON responses are automatically parsed.
        let labels: string[] = ["x"];
        let minValues: Array<string | number> = ["min"];
        let meanValues: Array<string | number> = ["mean"];
        let maxValues: Array<string | number> = ["max"];
        for (let stats of response.data) {
          labels.push(this.statsType.accessor(stats));
          minValues.push(stats.min);
          meanValues.push(stats.mean);
          maxValues.push(stats.max);
        }
        //return [labels, minValues, meanValues, maxValues]
        return [labels, meanValues];
      })
      .catch(e => {
        console.error(e);
        this.isError = true;
        //return [["x"], ["min"], ["mean"], ["max"]]
        return [["x"], ["mean"]];
      })
      .then(data => {
        this.chart.load({
          columns: data,
          unload: true
        });
        this.isLoading = false;
      });
  }
}

export interface StatsType {
  title: string;
  url: string;
  accessor: (stats: any) => string;
}

export const HOUR_OF_DAY: StatsType = {
  title: "Power Consumption per Hour of Day",
  url: "hour-of-day",
  accessor: stats => stats.hourOfDay
};

export const DAY_OF_WEEK: StatsType = {
  title: "Power Consumption per Day of Week",
  url: "day-of-week",
  accessor: stats => getDayOfWeekText(stats.dayOfWeek)
};

function getDayOfWeekText(number: number) {
  switch (number) {
    case 1: {
      return "Monday";
    }
    case 2: {
      return "Tuesday";
    }
    case 3: {
      return "Wednesday";
    }
    case 4: {
      return "Thursday";
    }
    case 5: {
      return "Friday";
    }
    case 6: {
      return "Saturday";
    }
    case 7: {
      return "Sunday";
    }
    default: {
      throw new RangeError("Day of week number must be between 1 and 7");
    }
  }
}
</script>

<style scoped>
.space-between {
  display: flex;
  justify-content: space-between;
}
.c3-container {
  height: 300px;
}
</style>
<style>
.c3-grid line {
  stroke: #dfdfdf;
}
.c3-xgrid,
.c3-ygrid {
  stroke-dasharray: 0;
}
</style>
