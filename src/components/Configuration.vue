<template>
    <b-container>
        <b-row class="mb-4">
            <b-col>
                <dragable-sensor-list :sensors="[modifiableSensorRegistry.topLevelSensor]" />
            </b-col>
            <b-col>
                <dragable-sensor-list :sensors="unselectedSensors" />
                <b-list-group class="mt-3">
                    <b-list-group-item class="d-flex align-items-center">
                        <b-input v-model="newAggregatedSensorName"
                            type="text" class="mr-3 w-auto"
                            placeholder="New aggregated sensor"
                            @keyup.enter.native="addSensor()" />
                        <code class="mr-auto">{{ newAggregatedSensorIdentifier }}</code>
                        <b-button @click="addSensor()" :variant="'link'" class="text-muted">
                            <font-awesome-icon icon="check" />
                        </b-button>
                    </b-list-group-item>
                </b-list-group>
            </b-col>
        </b-row>
        <b-row class="mb-4">
            <b-col>
                <b-button :disabled="saving || demoMode" variant="success" @click="save">
                    <font-awesome-icon v-if="saving" icon="spinner" spin />
                    <template v-else>Save</template>
                </b-button>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator"
import { Sensor, AggregatedSensor, MachineSensor, SensorRegistry } from '../SensorRegistry'
import { HTTP } from "../http-common"

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// @ts-ignore
import draggable from 'vuedraggable'

import DragableSensorList from './DragableSensorList.vue'
import SensorRegistryEntry from './SensorRegistryEntry.vue'

@Component({
    components: {
        DragableSensorList,
        SensorRegistryEntry,
        draggable
    }
})
export default class Configuration extends Vue {

    @Prop({ required: true }) sensorRegistry!: SensorRegistry

    modifiableSensorRegistry: SensorRegistry = SensorRegistry.flatCopy(this.sensorRegistry) //TODO

    saving = false

    unselectedSensors = new Array<Sensor>()

    newAggregatedSensorName = ""
    
    created() {
        HTTP.get('power-consumption')
            .then(response => {
                let unselectedSensors = response.data as Array<string>
                let registeredSensors = this.sensorRegistry.registeredSensors.map(s => s.identifier)
                this.unselectedSensors = unselectedSensors.filter(s => !registeredSensors.includes(s)).map(s => new MachineSensor(s, ""))
            })
            .catch(e => {
                console.error(e)
            })
    }

    @Watch("sensorRegistry") //TODO
    updateModifiableSensorRegistry() {
        this.modifiableSensorRegistry = SensorRegistry.flatCopy(this.sensorRegistry)
    }

    get demoMode() {
        return process.env.DEMO === "true"
    }

    private save() {
        this.saving = true
        HTTP.put('sensor-registry', this.modifiableSensorRegistry.toJson())
            .catch(e => {
                console.error(e)
            }).then(() => {
                this.$emit('update:sensor-registry')
                this.saving = false
            })
    }

    private addSensor() {
        this.unselectedSensors.push(new AggregatedSensor(this.newAggregatedSensorIdentifier, this.newAggregatedSensorName, []))
        this.newAggregatedSensorName = ""
    }

    private get newAggregatedSensorIdentifier() {
        return this.slugify(this.newAggregatedSensorName)
    }

    //TODO utility method
    private slugify = (text: String) => text.toString().toLowerCase()
                                    .replace(/\s+/g, '-')       // Replace spaces with -
                                    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
                                    .replace(/\-\-+/g, '-')     // Replace multiple - with single -
                                    .replace(/^-+/, '')         // Trim - from start of text
                                    .replace(/-+$/, '')         // Trim - from end of text

}
</script>

<style scoped>
</style>