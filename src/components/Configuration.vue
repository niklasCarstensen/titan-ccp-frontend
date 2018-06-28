<template>
    <b-container>
        <b-row>
            <b-col>
                <dragable-sensor-list :sensors="[modifiableSensorRegistry.topLevelSensor]" />
            </b-col>
            <b-col>
                <dragable-sensor-list :sensors="unselectedSensors" />
            </b-col>
        </b-row>
        <b-row>
            <b-button :disabled="saving" variant="success" @click="save">
                <font-awesome-icon v-if="saving" icon="spinner" spin />
                <template v-else>Save</template>
            </b-button>
        </b-row>    
        <b-row>
            <pre><code>{{ sensorRegistry.toPrettyJson() }}</code></pre>
        </b-row>
        <b-row>
            <pre><code>{{ modifiableSensorRegistry.toPrettyJson() }}</code></pre>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator"
import { Sensor, AggregatedSensor, MachineSensor, SensorRegistry } from '../SensorRegistry'
import { HTTP_CONFIGURATION } from "../http-common"

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// @ts-ignore
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';

// @ts-ignore
import draggable from 'vuedraggable'

import DragableSensorList from './DragableSensorList.vue'
import SensorRegistryEntry from './SensorRegistryEntry.vue'

@Component({
    components: {
        DragableSensorList,
        SensorRegistryEntry,
        draggable,
        FontAwesomeIcon
    }
})
export default class Configuration extends Vue {

    @Prop({ required: true }) sensorRegistry!: SensorRegistry

    modifiableSensorRegistry: SensorRegistry = SensorRegistry.flatCopy(this.sensorRegistry) //TODO

    saving = false

    // TODO
    unselectedSensors = [
        new MachineSensor("unused1", ""),
        new MachineSensor("unused2", ""),
        new MachineSensor("unused3", "")
    ]

    
    @Watch("sensorRegistry") //TODO
    updateModifiableSensorRegistry() {
        this.modifiableSensorRegistry = SensorRegistry.flatCopy(this.sensorRegistry)
    }

    save() {
        this.saving = true
        HTTP_CONFIGURATION.put('sensor-registry', this.modifiableSensorRegistry.toJson())
            .catch(e => {
                console.error(e)
            }).then(() => {
                    this.saving = false
            })
    }

}
</script>

<style scoped>
</style>