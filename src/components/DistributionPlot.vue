<template>
    <div class="card c3-container">
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { HTTP } from "../http-common";
import { generate } from 'c3';
import 'c3/c3.css';

@Component
export default class DistributionPlot extends Vue {
    
    private identifier = "root";

    mounted() {
         HTTP.get('aggregated-power-consumption/' + this.identifier + '/distribution?buckets=4')
            .then(response => {
                console.log(response.data)
                // JSON responses are automatically parsed.
                let labels: string[] = ["x"]
                let values: Array<string|number> = [this.identifier]
                for (let bucket of response.data) {
                    labels.push("" + bucket.lower + " - " + bucket.upper)
                    values.push(bucket.elements)
                }
                return [labels, values];
            })
            .catch(e => {
                console.error(e);
                return [[],[]];
            }).then(data2 => {
                let chart = generate({
                    bindto: this.$el,
                    data: {
                        x : 'x',
                        columns: data2,
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
            });

    }

}
</script>

<style scoped>
    .c3-container {
        height: 300px;
    }
</style>
