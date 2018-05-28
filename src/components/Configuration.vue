<template>
    <pre>{{ sensorRegistryAsString }}</pre>  
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator"
import { Sensor, AggregatedSensor, MachineSensor, SensorRegistry } from '../SensorRegistry'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

@Component({
    components: {
    }
})
export default class Configuration extends Vue {

    @Prop({ required: true }) sensorRegistry!: SensorRegistry

    get sensorRegistryAsString() {
        var seen = new Array<any>();
        return JSON.stringify(this.sensorRegistry, function(key, val) {
            if (val != null && typeof val == "object") {
                if (seen.indexOf(val) >= 0) {
                    return;
                }
                seen.push(val);
            }
            return val;
        }, '\t');
    }

}
</script>

<style scoped>

</style>