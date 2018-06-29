import { HTTP } from "./http-common";

export class SensorRegistryRequester {
    
    public request() {
        return HTTP.get('sensor-registry')
            .then(response => {
                // JSON responses are automatically parsed.
                //console.log(response.data);
                return SensorRegistry.parse(<JsonSensor> response.data)
            })
    }

}

export class SensorRegistry {
    
    constructor(readonly topLevelSensor: Sensor) {}

    public static parse(sensor: JsonSensor) : SensorRegistry {
        return new SensorRegistry(this.parseSensor(sensor))
    }

    public toJson(pretty?: boolean) {
        return JSON.stringify(this.topLevelSensor, (key, val) => key != "parent" ? val : undefined, pretty ? '\t' : undefined)
    }

    public toPrettyJson() {
        return this.toJson(true)
    }

    private static parseSensor(sensor: JsonSensor) : Sensor {
        if (sensor.children) {
            let children = sensor.children.map(child => this.parseSensor(child))
            let parsedSensor = new AggregatedSensor(sensor.identifier, sensor.name ? sensor.name : "", children)
            children.forEach(child => child.parent = parsedSensor)
            return parsedSensor
        } else {
            return new MachineSensor(sensor.identifier, sensor.name ? sensor.name : "")
        }
    }

    public static flatCopy(sensorRegistry: SensorRegistry): SensorRegistry {
        return new SensorRegistry(this.flatCopySensor(sensorRegistry.topLevelSensor))
    }

    private static flatCopySensor(sensor: Sensor): Sensor {
        if (sensor instanceof AggregatedSensor) {
            let children = sensor.children.map(child => this.flatCopySensor(child))
            return new AggregatedSensor(sensor.identifier, sensor.name, children)
        } else {
            return new MachineSensor(sensor.identifier, sensor.name)
        }
    }

}

export type Sensor = AggregatedSensor | MachineSensor;

export class AggregatedSensor {

    constructor(readonly identifier: string, readonly name: string, readonly children: Array<Sensor>) {}

    public parent?: AggregatedSensor //TODO make nicer

}

export class MachineSensor {
    
    constructor(readonly identifier: string, readonly name: string) {}

    parent?: AggregatedSensor //TODO make nicer

}

export interface JsonSensor {
    identifier: string
    name?: string
    children?: Array<JsonSensor>
}