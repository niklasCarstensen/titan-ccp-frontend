// @ts-ignore
import { CanvasTimeSeriesPlot } from './canvasplot.js';
declare var d3: any;

export class MovingTimeSeriesPlot {

	private width: number
	private height: number
	private yAxisLabel: string
	private color: string
	private plotStartsWithZero: boolean
	private defaultTimeSpan: number
	private defaultStartTime: Date
	private defaultYDomain: Array<number> // [start, end]
	private yDomainEnlargement: number // in % for both top and bottom
	private dataPoints: Array<Array<Date|number>>
	private plot: CanvasTimeSeriesPlot



	constructor(domContainer: HTMLElement,
		config?: any) {
		config = config || {};
		this.width = config.width || domContainer.clientWidth; // in px
		this.height = config.height ||domContainer.clientHeight; // in px
		this.yAxisLabel = config.yAxisLabel || "Measurement";
		this.color = config.color || "orange";
		this.plotStartsWithZero = config.plotStartsWithZero || false;
		//this.yAxisSpacing = config.yAxisSpacing || 65; // in px
		this.defaultTimeSpan = config.defaultTimeSpan || 60 * 1000; // one minute
		this.defaultStartTime = config.defaultStartTime || new Date();
		this.defaultYDomain = config.defaultYDomain || [0, 1];
		this.yDomainEnlargement = config.yDomainEnlargement || 0.1;

		this.dataPoints = [];
		this.plot = new CanvasTimeSeriesPlot(d3.select(domContainer), [this.width, this.height], {
			yAxisLabel: this.yAxisLabel,
			disableLegend: true,
			//plotMargins: { top: 20, right: 20, bottom: 30, left: this.yAxisSpacing },
			//updateViewCallback: (this.setViews).bind(this)
		});
		this.plot.setZoomYAxis(false);
		this.plot.updateDomains([this.defaultStartTime.getTime() - this.defaultTimeSpan, this.defaultStartTime], this.defaultYDomain, false);
	}
	
	public setDataPoints(dataPoints: Array<DataPoint>) {
		for (let dataPoint of dataPoints) {
			this.dataPoints.push(dataPoint.toArray());
		}
		this.plot.removeDataSet("measurements"); //TODO "measurements"
		this.plot.addDataSet("measurements", "", this.dataPoints, this.color, false, false); //TODO "measurements"
		if (this.dataPoints.length != 0) {
			this.plot.updateDomains(this.plot.calculateXDomain(), this.plot.getYDomain(), true);
			this.updateDomains();
		}
	}

	public addDataPoints(dataPoints: Array<DataPoint>) {
		let beforeCalculatedXDomain = Domain.of(this.plot.calculateXDomain());
		let beforeActualXDomain = Domain.of(this.plot.getXDomain());
		let beforeEmpty = (this.dataPoints.length == 0);
		for (let dataPoint of dataPoints) {
			// Updates also this.dataPoints
			this.plot.addDataPoint("measurements", dataPoint.toArray(), false, false); //TODO "measurements"
		}
		let afterCalculatedXDomain = Domain.of(this.plot.calculateXDomain());
		let afterActualXDomain = Domain.of(this.plot.getXDomain());
		if (beforeEmpty) {
			let xDomain: Domain;
			if (afterCalculatedXDomain.getLength() < this.defaultTimeSpan) {
				xDomain = new Domain(afterCalculatedXDomain.start, afterCalculatedXDomain.start + this.defaultTimeSpan);
			}
			else {
				xDomain = new Domain(afterCalculatedXDomain.end - this.defaultTimeSpan, afterCalculatedXDomain.end);
			}
			this.plot.updateDomains(xDomain, this.plot.getYDomain(), false);
		}
		else {
			if (beforeCalculatedXDomain.end <= beforeActualXDomain.end && afterCalculatedXDomain.end > afterActualXDomain.end) {
				let shifting = afterCalculatedXDomain.end - beforeCalculatedXDomain.end;
				//TODO rework this
				var xDomain = [this.plot.getXDomain()[0] * 1 + shifting, this.plot.getXDomain()[1] * 1 + shifting];
				this.plot.updateDomains(xDomain, this.plot.getYDomain(), false);
			}
		}
		this.updateDomains();
	}

	//TODO Does this work?
	/*
	private setViews(xDomain: Array<number>) {
		this.plot.updateDomains(xDomain, this.plot.getYDomain(), false);
	}
	*/

	private updateDomains() {
		let yDomain = Domain.of(this.plot.calculateYDomain());
		let enlargement = yDomain.getLength() * this.yDomainEnlargement
		yDomain.start -= enlargement
		yDomain.end += enlargement
		if (this.plotStartsWithZero) {
			yDomain.start = 0;
		}
		this.plot.updateDomains(this.plot.getXDomain(), yDomain.toArray(), false);
	}

}

export class DataPoint {
	public constructor(public date: Date, public value: number){}

	public toArray() {
		return [this.date, this.value]
	}
}

export class Domain {
	public constructor(public start: number, public end: number){}

	public getLength() {
		return this.end - this.start
	}

	public toArray() {
		return [this.start, this.end]
	}

	public static of(domain: Array<number>) {
		if (domain.length < 2) {
			new Error('Domain array must have at least two elements.')
		}
		return new Domain(domain[0], domain[1])
	}

}