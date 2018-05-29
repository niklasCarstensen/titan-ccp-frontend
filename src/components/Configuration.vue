<template>
    <b-container>
        <b-row>
            <b-col>
                <ul>   
                    <li>
                        <div>{{ mySensorRegistry.topLevelSensor.identifier }}</div>
                        <dragable-sensor-list :sensors="mySensorRegistry.topLevelSensor.children" />
                    </li>
                </ul>
            </b-col>
            <b-col>
                <ul>
                    <draggable v-model="unselectedSensors" class="dragArea" :options="{group:'people'}">
                        <li v-for="sensor in unselectedSensors" :key="sensor.identifier">
                            {{sensor.identifier}}
                        </li>
                    </draggable>
                </ul>
            </b-col>
        </b-row>
        <b-row>
            <pre><code>{{ sensorRegistryAsString }}</code></pre>
        </b-row>
        <b-row>
            <pre><code>{{ mySensorRegistryAsString }}</code></pre>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator"
import { Sensor, AggregatedSensor, MachineSensor, SensorRegistry } from '../SensorRegistry'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// @ts-ignore
import draggable from 'vuedraggable'

import DragableSensorList from './DragableSensorList.vue'

@Component({
    components: {
        draggable,
        DragableSensorList
    }
})
export default class Configuration extends Vue {

    @Prop({ required: true }) sensorRegistry!: SensorRegistry

    mySensorRegistry: SensorRegistry = SensorRegistry.flatCopy(this.sensorRegistry) //TODO

    @Watch("sensorRegistry") //TODO
    updateMySensorRegistry() {
        return SensorRegistry.flatCopy(this.sensorRegistry)
    }

    //TODO
    unselectedSensors = [
        new MachineSensor("unused1"),
        new MachineSensor("unused2"),
        new MachineSensor("unused3")
    ]

    get sensorRegistryAsString() {
        return JSON.stringify(this.sensorRegistry, (key, val) => key != "parent" ? val : undefined, '\t');
    }

    get mySensorRegistryAsString() {
        return JSON.stringify(this.mySensorRegistry, (key, val) => key != "parent" ? val : undefined, '\t');
    }

}
</script>

<style scoped>


</style>