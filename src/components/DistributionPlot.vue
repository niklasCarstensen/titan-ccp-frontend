<template>
    <div class="card c3-container">
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { HTTP } from "../http-common";
import { Sensor } from '../SensorRegistry'
import { ChartAPI, generate } from 'c3';
import 'c3/c3.css';

@Component
export default class DistributionPlot extends Vue {

    @Prop({ required: true }) sensor!: Sensor

    @Prop({ default: 4}) buckets!: number

    private chart!: ChartAPI

    mounted() {
        this.chart = generate({
            bindto: this.$el,
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
        HTTP.get('aggregated-power-consumption/' + this.sensor.identifier + '/distribution?buckets=' + this.buckets)
            .then(response => {
                // JSON responses are automatically parsed.
                let labels: string[] = ["x"]
                let values: Array<string|number> = [this.sensor.identifier]
                for (let bucket of response.data) {
                    labels.push("" + bucket.lower + " - " + bucket.upper)
                    values.push(bucket.elements)
                }
                return [labels, values];
            })
            .catch(e => {
                console.error(e);
                return [[],[]];
            }).then(data => {
                this.chart.load({
                    columns: data
                });
            });
    }
}
</script>

<style scoped>
    .c3-container {
        height: 300px;
    }
</style>
