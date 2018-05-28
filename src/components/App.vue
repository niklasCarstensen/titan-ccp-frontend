<template>
    <div>
        <nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
            <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">Titan Control Center</a>
            <ul class="navbar-nav px-3">
                <li class="nav-item text-nowrap">
                <a class="nav-link" href="#">Sign out</a>
                </li>
            </ul>
        </nav>
        <div class="container-fluid">
            <div class="row">
                <nav class="col-md-2 d-none d-md-block bg-light sidebar">
                    <div class="sidebar-sticky">
                        <ul class="nav flex-column">
                            <li class="nav-item">
                                <a class="nav-link" href="#" v-on:click="makeActive('dashboard')">
                                    <span data-feather="home"></span>
                                    Dashboard
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#" v-on:click="makeActive('sensor-details')">
                                    <span data-feather="home"></span>
                                    Sensor Details
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#" v-on:click="makeActive('configuration')">
                                    <span data-feather="home"></span>
                                    Configuration
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#" v-on:click="makeActive('examples')">
                                    <span data-feather="home"></span>
                                    Examples
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>

                <main role="main" class="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
                    <div v-if="show">
                        <dashboard v-if="isActive('dashboard')" :sensor="rootSensor" />
                        <sensor-details v-if="isActive('sensor-details')" :sensor="rootSensor" />
                        <configuration v-if="isActive('configuration')" :sensorRegistry="sensorRegistry2" />
                        <examples v-if="isActive('examples')" />
                    </div>
                    <div v-if="!show" >Loading...</div>
                </main>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator"
import { Sensor, AggregatedSensor, MachineSensor, SensorRegistry } from '../SensorRegistry'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import { SensorRegistryRequester } from '../SensorRegistry'

import Dashboard from "./Dashboard.vue"
import SensorDetails from "./SensorDetails.vue"
import Configuration from "./Configuration.vue"
import Examples from "./Examples.vue"

@Component({
    components: {
        Dashboard,
        SensorDetails,
        Configuration,
        Examples,
    }
})
export default class App extends Vue {

    private sensorRegistry = new SensorRegistryRequester().request()
    private sensorRegistry2 = new SensorRegistry(new MachineSensor("--PENDING--"))

    private rootSensor: Sensor = new MachineSensor("--PENDING--")
    private show = false;

    private activePage = "dashboard"

    created() {
        this.sensorRegistry.then(registry => {
            //this.sensorRegistryAsString = JSON.stringify(registry, null, '\t')
            setTimeout(() => {
                //this.rootSensor = registry.topLevelSensor
                //this.show = true
            }, 5000);
            this.rootSensor = registry.topLevelSensor
            this.sensorRegistry2 = registry
            this.show = true  
        })
    }

    private makeActive(page: string) {
        this.activePage = page
    }
    
    private isActive(page: string) {
        return this.activePage === page
    }

}
</script>

<style scoped>

</style>