import {
    AggregatedSensor,
    Sensor,
} from "./SensorRegistry";
import { HTTP } from "./http-common";
import "c3/c3.css";
import ChartDataLoader from "./ChartDataLoader";

export default class ChartTimeDataLoader extends ChartDataLoader {
    public data = [
        {
            identifier: "",
            title: "",
            value: 0,
            drawCurRadius: 0, // for ModPieChart
            children: [
                {
                    identifier: "",
                    title: "",
                    value: 0,
                    valuePercent: 0
                }
            ]
        }
    ];

    public async getAPIData(
        sensor: AggregatedSensor
    ): Promise<boolean> {
        // Remove sample element
        this.data.shift();

        for (let i = 0; i < 24; i++)
            this.data.push({
                identifier: i + ":00",
                title: i + ":00",
                value: 0,
                drawCurRadius: 1,
                children: []
            });

        for (const x of sensor.children) {
            if (x instanceof AggregatedSensor)
                await this.addSensorData(x as AggregatedSensor)
        }

        return false;
    }

    private async addSensorData(sensor: AggregatedSensor): Promise<void> {
        const response = await HTTP.get("http://localhost:8070/api/stats/sensor/" + sensor.identifier + "/hour-of-day");

        for (let i = 0; i < response.data.length; i++) {
            let value = response.data[i].mean;
            if (!(value > 0)) // In case of invalid data set value to a small number
                value = Number.MIN_VALUE;

            this.data[i].children.push({
                identifier: sensor.identifier,
                title: sensor.title,
                value: value,
                valuePercent: 0
            });
            this.data[i].value += value;
        }
    }
}