//import CanvasDataPlot from './canvasplot';
import * as D3 from 'd3';
import './canvasplot.exec.js';

export class MyClass {
    //firstName;
    constructor() {
        this.firstName = 'hello';
        console.log("MyClass created, 2");

        let x = D3.select("body");

        console.log("->")
        console.log(CanvasDataPlot);
        console.log("<-")

        var tsPlot = new CanvasDataPlot(x, [750,400], {
            yAxisLabel: "Voltage [V]"
        });
    }
}