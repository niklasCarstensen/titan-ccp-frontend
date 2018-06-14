<template>
    <div class="card text-center">
        <div class="card-body">
            <font-awesome-icon icon="arrow-right" :transform="{ rotate: rotation }" size="4x" :class="color" />
            <div class="text-muted">{{ text }}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { AggregatedSensor, Sensor } from '../SensorRegistry'
import { HTTP } from "../http-common";
import { DateTime } from "luxon"

// @ts-ignore
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';

@Component({
    components: {
        FontAwesomeIcon
    }
})
export default class TrendArrow extends Vue {

    @Prop({ required: true }) sensor!: Sensor

    @Prop({ required: true }) timespan!: Timespan

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
        let after = new Date().getTime() - (3600 * 1000)
        HTTP.get(resource + '/' + this.sensor.identifier + '/trend?after=' + this.after.toMillis())
            .then(response => {
                this.trendValue = 1 / response.data as number //TODO Temporary
            })
            .catch(e => {
                console.error(e)
            });
    }

    private get after() {
        let now = DateTime.local()
        switch(this.timespan) { 
            case Timespan.LastHour: {
                return now.minus({hours: 1})
            } 
            case Timespan.LastDay: { 
                return now.minus({days: 1})
            }
            case Timespan.LastWeek: { 
                return now.minus({weeks: 1})
            }
        }
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
            return "text-danger"
        } else if (this.trendValue > 1.1) {
            return "text-danger"
        } else if (this.trendValue > 0.9) {
            return "text-warning"
        } else if (this.trendValue > 0.5) {
            return "text-success"
        } else {
            return "text-success"
        }
    }

    get text() {
        switch(this.timespan) { 
            case Timespan.LastHour: {
                return "Last hour"
            } 
            case Timespan.LastDay: { 
                return "Last 24 hours"
            }
            case Timespan.LastWeek: { 
                return "Last 7 days"
            }
        }
    }

}

export enum Timespan {
    LastHour,
    LastDay,
    LastWeek
}

</script>

<style scoped>
    .c3-container {
        height: 300px;
    }
</style>
