import {
    AggregatedSensor,
    Sensor,
} from "./SensorRegistry";
import "c3/c3.css";

export default abstract class ChartDataLoader {
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

    public abstract async getAPIData(
        sensor: AggregatedSensor
    ): Promise<boolean>;
}