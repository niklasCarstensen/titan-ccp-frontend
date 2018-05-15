<template>
    <div class="card c3-container">
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

//import {britecharts, LineChart, Line, xyz} from 'britecharts';
import { generate } from 'c3';
import 'c3/c3.css';

@Component
export default class C3Example extends Vue {
    
    mounted() {
        let chart = generate({
            bindto: this.$el,
            data: {
                x : 'x',
                columns: [
                    ['x', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth'],
                    ['data2', 50, 20, 10, 40, 15, 25]
                ],
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
    }

}
</script>

<style scoped>
    .c3-container {
        height: 300px;
    }
</style>
