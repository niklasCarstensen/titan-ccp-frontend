import { HTTP_CONFIGURATION } from "./http-common";

export class SensorRegistryRequester {
    
    public request() {
        return HTTP_CONFIGURATION.get('sensor-registry/')
        .then(response => {
            // JSON responses are automatically parsed.
            //console.log(response.data);
            return SensorRegistry.parse(<JsonSensor> response.data)
        })
        .catch(e => {
            console.error(e)
            return new SensorRegistry(new MachineSensor(""))
        });

    }

}

export class SensorRegistry {
    
    constructor(readonly topLevelSensor: Sensor) {}

    public static parse(sensor: JsonSensor) : SensorRegistry {
        return new SensorRegistry(this.parseSensor(sensor))
    }

    private static parseSensor(sensor: JsonSensor) : Sensor {
        if (sensor.children) {
            let children = sensor.children.map(child => this.parseSensor(child))
            return new AggregatedSensor(sensor.identifier, children)
        } else {
            return new MachineSensor(sensor.identifier)
        }
    }

}

export type Sensor = AggregatedSensor | MachineSensor;

export class AggregatedSensor {

    constructor(readonly identifier: string, readonly children: Array<Sensor>) {}

}

export class MachineSensor {
    
    constructor(readonly identifier: string) {}

}

export interface JsonSensor {
    identifier: string
    children?: Array<JsonSensor>
}