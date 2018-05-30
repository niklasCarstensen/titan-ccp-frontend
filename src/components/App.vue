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
                                    <font-awesome-icon icon="tachometer-alt" fixed-width class="feather" />
                                    Dashboard
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#" v-on:click="makeActive('sensor-details')">
                                    <font-awesome-icon icon="chart-bar" fixed-width class="feather" />
                                    Sensor Details
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#" v-on:click="makeActive('configuration')">
                                    <font-awesome-icon icon="sliders-h" fixed-width class="feather" />
                                    Configuration
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#" v-on:click="makeActive('examples')">
                                    <font-awesome-icon icon="play" fixed-width class="feather" />
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

// @ts-ignore
import fontawesome from '@fortawesome/fontawesome'
// @ts-ignore
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
// @ts-ignore
import fasliders from '@fortawesome/fontawesome-free-solid'

fontawesome.library.add(fasliders);

//Vue.component(FontAwesomeIcon.name, FontAwesomeIcon);

import { SensorRegistryRequester } from '../SensorRegistry'

import Dashboard from "./Dashboard.vue"
import SensorDetails from "./SensorDetails.vue"
import Configuration from "./Configuration.vue"
import Examples from "./Examples.vue"

@Component({
    components: {
        FontAwesomeIcon,

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

.feather {
  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
}

/*
 * Sidebar
 */

.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100; /* Behind the navbar */
  padding: 0;
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
}

.sidebar-sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 48px; /* Height of navbar */
  height: calc(100vh - 48px);
  padding-top: .5rem;
  overflow-x: hidden;
  overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
}

.sidebar .nav-link {
  font-weight: 500;
  color: #333;
}

.sidebar .nav-link .feather {
  color: #999;
  margin-right: 4px;
}

.sidebar .nav-link.active {
  color: #007bff;
}

.sidebar .nav-link:hover .feather,
.sidebar .nav-link.active .feather {
  color: inherit;
}

.sidebar-heading {
  font-size: .75rem;
  text-transform: uppercase;
}

/*
 * Navbar
 */

.navbar-brand {
  padding-top: .75rem;
  padding-bottom: .75rem;
  font-size: 1rem;
  background-color: rgba(0, 0, 0, .25);
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .25);
}

</style>