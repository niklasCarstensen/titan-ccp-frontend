// @ts-ignore
import { CanvasTimeSeriesPlot } from './globals.js';
declare var d3: any;

export function greeter() {
    test();
}

function test() {
    console.log("CanvasTimeSeriesPlot:");
    console.log(CanvasTimeSeriesPlot);


    let y = new Example();
    y.test2();
    
}

export default class Example {

    public test2() {
        var ts1 = [];
        var ts2 = [];
        var now = new Date();
        for(var i=0; i<3*48; ++i) {
            var time = new Date(now.getTime());
            time.setHours(i);
            ts1.push([time, Math.sin(Math.PI * i/48) + 0.2*(Math.random()-0.5)]);
            ts2.push([time, Math.cos(Math.PI * i/48) + 0.2*(Math.random()-0.5)]);
        }
        var tsPlot = new CanvasTimeSeriesPlot(d3.select("#plot"), [750,400], {
            yAxisLabel: "Voltage [V]"
        });
        tsPlot.addDataSet("ds1", "Signal 1", ts1, "orange", false);
        tsPlot.addDataSet("ds2", "Signal 2", ts2, "steelblue", true);
        tsPlot.setZoomYAxis(false);
    }

}