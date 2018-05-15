<template>
    <div class="card c3-container">
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { SensorRegistryRequester, AggregatedSensor, Sensor, SensorRegistry } from '../SensorRegistryRequester'
import { HTTP } from "../http-common";
import { generate } from 'c3';
import 'c3/c3.css';

@Component
export default class C3PieExample2 extends Vue {
    
    //@Prop({ required: true }) sensorRegistry!: Promise<SensorRegistry>

    mounted() {
        //this.sensorRegistry.then(registry => {
        new SensorRegistryRequester().request().then(registry => {
            if (registry.topLevelSensor instanceof AggregatedSensor) {
                return registry.topLevelSensor.children
            } else {
                return []
            }
        }).then(children => {
            return Promise.all(children.map(child => {
                let resource = child instanceof AggregatedSensor ? 'aggregated-power-consumption' : 'power-consumption' 
                return HTTP.get(resource + '/' + child.identifier + '/latest')
                    .then(response => {
                        // JSON responses are automatically parsed.
                        let value
                        if (response.data.length <= 0) {
                            value = 0
                        } else if (child instanceof AggregatedSensor) {
                            value = response.data[0].sum
                        } else {
                            value = response.data[0].powerConsumptionInWh
                        }
                        return <[string, number]> [child.identifier, value];
                    })
                    .catch(e => {
                        console.error(e);
                        return <[string, number]> [child.identifier, 0];
                    });
            }))
        }).then(columns => {
            let chart = generate({
                bindto: this.$el,
                data: {
                    columns: columns,
                    type : 'pie'
                },
                tooltip: {
                    show: false
                }
            });
        });

        
    }

}
</script>

<style scoped>
    .c3-container {
        height: 300px;
    }
</style>
