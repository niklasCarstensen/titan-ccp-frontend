<template>
    <div class="card">
        <loading-spinner :is-loading="isLoading">
            <div class="c3-container"></div>
        </loading-spinner>
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
export default class DistributionPlot extends Vue {

    @Prop({ required: true }) sensor!: Sensor

    @Prop({ default: 4}) buckets!: number

    private chart!: ChartAPI

    private isLoading = true

    mounted() {
        this.chart = generate({
            bindto: this.$el.querySelector(".c3-container") as HTMLElement,
            data: {
                x : 'x',
                columns: [],
                type: 'bar'
            },
            legend: {
                show: false
            },
            axis: {
                x: {
                    type: 'category' // this needed to load string x value
                }
            },
            tooltip: {
                show: false
            }
        });
        this.createPlot();
    }

    @Watch('sensor')
    onSensorChanged(sensor: Sensor) {
        this.createPlot();
    }

    private createPlot() {
        let resource = this.sensor instanceof AggregatedSensor ? 'aggregated-power-consumption' : 'power-consumption'
        HTTP.get(resource + '/' + this.sensor.identifier + '/distribution?buckets=' + this.buckets)
            .then(response => {
                // JSON responses are automatically parsed.
                let labels: string[] = ["x"]
                let values: Array<string|number> = [this.sensor.identifier]
                for (let bucket of response.data) {
                    labels.push("" + bucket.lower.toFixed(1) + " - " + bucket.upper.toFixed(1))
                    values.push(bucket.elements)
                }
                return [labels, values];
            })
            .catch(e => {
                console.error(e);
                return [[],[]];
            }).then(data => {
                this.chart.unload()
                this.chart.load({
                    columns: data,
                    unload: true
                })
                this.isLoading = false
            });
    }
}
</script>

<style scoped>
    .c3-container {
        height: 300px;
    }
</style>
