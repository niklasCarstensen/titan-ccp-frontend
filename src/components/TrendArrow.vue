<template>
    <div class="card text-center">
        <div class="card-body">
            <font-awesome-icon icon="arrow-right" :transform="{ rotate: rotation }" size="4x" :class="color" />
            <div class="text-muted">{{ trendValue }}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { AggregatedSensor, Sensor } from '../SensorRegistry'
import { HTTP } from "../http-common";

// @ts-ignore
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';

@Component({
    components: {
        FontAwesomeIcon
    }
})
export default class TrendArrow extends Vue {

    @Prop({ required: true }) sensor!: Sensor

    after = 0

    trendValue = -1

    mounted() {
        console.log("Sensor " + this.sensor.identifier)
        this.updateChart()
    }

    @Watch('sensor')
    onSensorChanged() {
        this.updateChart()
    }

    private updateChart() {
        let resource = this.sensor instanceof AggregatedSensor ? 'aggregated-power-consumption' : 'power-consumption'
        HTTP.get(resource + '/' + this.sensor.identifier + '/trend?after=' + this.after)
            .then(response => {
                this.trendValue = 1 / response.data as number //TODO Temporary
            })
            .catch(e => {
                console.error(e)
            });
    }

    get rotation() {
        if (this.trendValue > 1.5) {
            return 270
        } else if (this.trendValue > 1.1) {
            return 315
        } else if (this.trendValue > 0.9) {
            return 0
        } else if (this.trendValue > 0.5) {
            return 45
        } else {
            return 90
        }
    }

    get color() {
        if (this.trendValue > 1.5) {
            return "text-success"
        } else if (this.trendValue > 1.1) {
            return "text-success"
        } else if (this.trendValue > 0.9) {
            return "text-warning"
        } else if (this.trendValue > 0.5) {
            return "text-danger"
        } else {
            return "text-danger"
        }
    }


}
</script>

<style scoped>
    .c3-container {
        height: 300px;
    }
</style>
