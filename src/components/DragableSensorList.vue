<template>
    <ul>
        <draggable :list="sensors" :options="{group:'people'}" @start="drag=true" @end="drag=false" class="dragArea">
            <li v-for="sensor in sensors" :key="sensor.id">
                <div>{{sensor.identifier}}</div>
                <div v-if="isAggregatedSensor(sensor)">
                    <DragableSensorList :sensors="sensor.children" />
                </div>
            </li>
        </draggable>
    </ul>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator"
import { Sensor, AggregatedSensor, MachineSensor, SensorRegistry } from '../SensorRegistry'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// @ts-ignore
import draggable from 'vuedraggable'

@Component({
    components: {
        draggable,
        DragableSensorList
    }
})
export default class DragableSensorList extends Vue {

    @Prop({ required: true }) sensors!: Sensor[]

    private isAggregatedSensor = (sensor: Sensor)  => sensor instanceof AggregatedSensor
    

}
</script>

<style scoped>
.dragArea {
  min-height: 10px;
  background-color: rgba(0,0,0,0.1);
}
.sortable-ghost {
    border: 2px dashed steelblue;
}
</style>