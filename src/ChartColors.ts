import * as d3 from "d3";

export default class ChartColors {
    private static colorSet = 1;

    private static readonly color = [
        "#66c2FF",
        "#fc8d62",
        "#8da0cb",
        "#e78ac3",
        "#a6d854",
        "#ffd92f",
        "#66c2a5",
        "#fc8d62",
        "#8da0cb",
        "#e78ac3",
        "#a6d854",
        "#ffd92f"
    ];

    public static get(i: number): string {
        switch (this.colorSet) {
            case 0:
                return this.color[i % this.color.length];
            case 1:
                {
                    const colorArray = (d3.range(1 / 12, 1, 1 / 12).map(function (d: number) {
                        return d3.interpolateRgb("#108bff", "#fd7e14")(d)
                    }).concat(d3.range(1, 1 / 12, -1 / 12).map(function (d: number) {
                        return d3.interpolateRgb("#108bff", "#fd7e14")(d)
                    })));
                    const hexRes = d3.color(colorArray[Math.abs(i) % colorArray.length])?.hex();
                    return hexRes === undefined ? "#111111" : hexRes;
                }
                break;
        }
        return "#000000"
    }

    public static brighten(color: string, percent: number): string {
        // const d3Color = d3.color(color);
        // d3Color?.brighter(percent);
        // const res = d3Color?.hex();
        // if (res !== undefined)
        //     return res;
        // else
        //     return "#000000";

        const r = parseInt(color.substr(1, 2), 16);
        const g = parseInt(color.substr(3, 2), 16);
        const b = parseInt(color.substr(5, 2), 16);

        return (
            "#" +
            Math.min(255, Math.floor(r * percent)).toString(16) +
            Math.min(255, Math.floor(g * percent)).toString(16) +
            Math.min(255, Math.floor(b * percent)).toString(16)
        );
    }
}