import {
    AggregatedSensor
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
        const response = await HTTP.get("http://localhost:8070/api/stats/sensor/" + sensor.identifier +
            "/hour-of-day?intervalStart=2019-09-24T00:00:00Z&intervalEnd=2019-10-24T00:00:00Z");

        for (let i = 0; i < response.data.length; i++) {
            const value = response.data[i].mean;
            if (value > 0) { // Ignore Invalid data
                this.data[response.data[i].hourOfDay].children.push({
                    identifier: sensor.identifier,
                    title: sensor.title,
                    value: value,
                    valuePercent: 0
                });
                this.data[response.data[i].hourOfDay].value += value;
            }
        }
    }
}