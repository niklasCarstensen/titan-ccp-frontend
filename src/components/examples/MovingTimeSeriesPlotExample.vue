<template>
    <div class="card canvasplot-container">
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { MovingTimeSeriesPlot, DataPoint } from '../../MovingTimeSeriesPlot';

@Component
export default class MovingTimeSeriesPlotExample extends Vue {
    mounted() {
        let plot = new MovingTimeSeriesPlot(this.$el);

        var last = Math.random() * 100

        plot.setDataPoints([]);

        setInterval(() => {
            let newValue = last + (Math.random() * 10) - 5            
            plot.addDataPoints([new DataPoint(new Date(), newValue)])
            last = newValue
        }, 200);
    }
}
</script>

<style scoped>
    .canvasplot-container {
        height: 500px;
    }
</style>