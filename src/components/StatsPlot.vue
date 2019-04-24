<template>
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">{{ statsType.title }}</h5>
            <loading-spinner :is-loading="isLoading" :is-error="isError">
                <div class="c3-container"></div>
            </loading-spinner>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import LoadingSpinner from "./LoadingSpinner.vue"
import { HTTP } from "../http-common";
import { Sensor, AggregatedSensor } from '../SensorRegistry'
import { ChartAPI, generate } from 'c3';
import 'c3/c3.css';

@Component({
    components: {
        LoadingSpinner
    }
})
export default class StatsPlot extends Vue {

    @Prop({ required: true }) sensor!: Sensor

    @Prop({ required: true }) statsType!: StatsType

    private chart!: ChartAPI

    private isLoading = true
    private isError = false

    mounted() {
        this.chart = generate({
            bindto: this.$el.querySelector(".c3-container") as HTMLElement,
            data: {
                x : 'x',
                columns: [],
                type: 'spline'
            },
            legend: {
                show: false
            },
            axis: {
                x: {
                    
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
        })
        this.createPlot()
    }

    @Watch('sensor')
    onSensorChanged(sensor: Sensor) {
        this.createPlot()
    }

    private createPlot() {
        HTTP.get('/stats/' + this.sensor.identifier + '/' + this.statsType.url ) //hour-of-day'
            .then(response => {
                // JSON responses are automatically parsed.
                let labels: string[] = ["x"]
                let values: Array<string|number> = ["mean"]
                for (let stats of response.data) {
                    labels.push(this.statsType.accessor(stats))
                    values.push(stats.mean)
                }
                return [labels, values]
            })
            .catch(e => {
                console.error(e);
                this.isError = true
                return [["x"], ["mean"]]
            })
            .then(data => {
                this.chart.unload()
                this.chart.load({
                    columns: data,
                    unload: true
                })
                this.isLoading = false
            })
    }
}

export interface StatsType {
    title: string
    url: string
    accessor: (stats: any) => string
}

export const HOUR_OF_DAY: StatsType = {
    title: "Power Consumption per Hour of Day",
    url: "hour-of-day",
    accessor: stats => stats.hourOfDay
}

export const DAY_OF_WEEK: StatsType = {
    title: "Power Consumption per Day of Week",
    url: "day-of-week",
    accessor: stats => stats.dayOfWeek
}

</script>

<style scoped>
    .c3-container {
        height: 300px;
    }
</style>
