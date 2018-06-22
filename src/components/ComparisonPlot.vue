<template>
    <b-row>
        <b-col sm="9">
            <div class="canvasplot-container"></div>
        </b-col>
        <b-col sm="3">
            <b-button-close @click="remove()" />
            Sensors:
            <ul>
                <li v-for="dataSet in dataSets" :key="dataSet.sensor">
                    {{ dataSet.sensor }}
                    <b-button-close @click="removeDataSet(dataSet)" />
                </li>
            </ul>
            <input autocomplete="off"
                    placeholder="Sensor name"
                    v-model="newDataSet"
                    @keyup.enter="addDataSet(plot)">
        </b-col>
    </b-row>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { HTTP } from "../http-common";
import { Sensor, AggregatedSensor, MachineSensor } from '../SensorRegistry'
import ColorRepository from '../ColorRepository'
// @ts-ignore
import { CanvasTimeSeriesPlot } from '../canvasplot.js';
import { DataPoint } from '../MovingTimeSeriesPlot';
declare var d3version3: any;

@Component
export default class ComparisonPlot extends Vue {

    readonly after = new Date().getTime() - (1 * 3600 * 1000)

    readonly dataSets = new Array<DataSet>()

    newDataSet = ""

    @Prop() domainX!: Array<Date>

    @Prop()
    colors!: ColorRepository

    private plot!: CanvasTimeSeriesPlot // Will definitely be assigned in mounted

    get canvasplotContainer() {
        return this.$el.querySelector(".canvasplot-container")!
    }

    mounted() {
        this.plot = new CanvasTimeSeriesPlot(
            d3version3.select(this.canvasplotContainer),
            [this.canvasplotContainer.clientWidth, this.canvasplotContainer.clientHeight],
            {
                //plotMargins: { top: 20, right: 20, bottom: 30, left: this.yAxisSpacing },
                updateViewCallback: (this.updatedView).bind(this)
            }
        )
        this.plot.setZoomYAxis(false);
    }

    remove() {
        this.$emit('remove')
    }

    removeDataSet(dataSet: DataSet) {
        this.dataSets.splice(this.dataSets.indexOf(dataSet), 1)
        this.colors.free(dataSet.sensor)
        this.plot.removeDataSet(dataSet.sensor)
    }

    async addDataSet() {
        let dataSet = new DataSet(this.newDataSet)
        this.dataSets.push(dataSet)
        this.newDataSet = ""

        let color = this.colors.get(dataSet.sensor)
        let updateDomains = true
        let dataPoints = await this.fetchNewData(new MachineSensor(dataSet.sensor))
        this.plot.addDataSet(dataSet.sensor, dataSet.sensor, dataPoints.map(dataPoint => dataPoint.toArray()), color, updateDomains, false)
    }

    updatedView(except: any, xDomain: any, yDomain: any) {
        this.$emit("update-domain-x", xDomain)
    }

    @Watch('domainX')
    syncView() {
        let currentXDomain = this.plot.getXDomain()
        if (currentXDomain[0].getTime() != this.domainX[0].getTime() || currentXDomain[1].getTime() != this.domainX[1].getTime()) {
            this.plot.updateDomains(this.domainX, this.plot.getYDomain(), false)
        }
    }

    private fetchNewData(sensor: Sensor): Promise<DataPoint[]> {   
        let resource = sensor instanceof AggregatedSensor ? 'aggregated-power-consumption' : 'power-consumption' 
        return HTTP.get(resource + '/' + sensor.identifier + '?after=' + this.after)
            .then(response => {
                // JSON responses are automatically parsed.
                // TODO access sum generically
                return response.data.map((x: any) => new DataPoint(new Date(x.timestamp), sensor instanceof AggregatedSensor ? x.sumInW : x.valueInW));
            })
            .catch(e => {
                console.error(e);
                return []
            });
    }

}

class DataSet {

    constructor (readonly sensor: string) {}

}

</script>

<style scoped>
    .canvasplot-container {
        height: 300px;
    }
</style>