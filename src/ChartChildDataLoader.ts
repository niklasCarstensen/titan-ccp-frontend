import {
    AggregatedSensor,
    Sensor,
} from "./SensorRegistry";
import { HTTP } from "./http-common";
import "c3/c3.css";
import ChartDataLoader from "./ChartDataLoader";

export default class ChartChildDataLoader extends ChartDataLoader {
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
        const sens = sensor.children.concat(
            sensor.children
                .filter(x => x instanceof AggregatedSensor)
                .map(x => (x as AggregatedSensor).children)
                .reduce((x, y) => x.concat(y))
        );
        return await Promise.all(sens.map(s => this.addToDataList(this.data, s)))
            .catch(e => {
                console.error(e);
                return true;
            })
            .then(() => {
                // Remove sample element
                this.data.shift();

                return false;
            });
    }
    private async addToDataList(
        data: {
            identifier: string;
            title: string;
            value: number;
            drawCurRadius: number;
            children: {
                identifier: string;
                title: string;
                value: number;
                valuePercent: number;
            }[];
        }[],
        child: Sensor
    ): Promise<void> {
        const resource =
            child instanceof AggregatedSensor
                ? "aggregated-power-consumption"
                : "power-consumption";
        const response = await HTTP.get(resource + "/" + child.identifier + "/latest");
        // JSON responses are automatically parsed.
        let value;
        if (response.data.length <= 0) {
            value = 0;
        }
        else if (child instanceof AggregatedSensor) {
            value = response.data[0].sumInW;
        }
        else {
            value = response.data[0].valueInW;
        }

        if (!(value > 0)) // In case of invalid data set value to a small number
            value = Number.MIN_VALUE;

        if (child.parent !== undefined) {
            if (child.parent.identifier === "root") {
                data.push({
                    identifier: child.identifier,
                    title: child.title,
                    value: value,
                    drawCurRadius: 1,
                    children: []
                });
            }
            else {
                const par = data.find(x => child.parent !== undefined &&
                    x.identifier == child.parent.identifier);
                if (par !== undefined) {
                    par.children.push({
                        identifier: child.identifier,
                        title: child.title,
                        value: value,
                        valuePercent: 0
                    });
                }
                else {
                    console.log("Lost child!" + child.identifier);
                }
            }
        }
    }
}