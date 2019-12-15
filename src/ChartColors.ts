

export default class ChartColors {
    public static readonly color = [
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

    public static brighten(color: string, percent: number): string {
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