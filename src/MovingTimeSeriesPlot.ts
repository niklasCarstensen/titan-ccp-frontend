// @ts-ignore
import { CanvasTimeSeriesPlot } from './canvasplot.js';
declare var d3version3: any;

export class MovingTimeSeriesPlot {

	private width: number
	private height: number
	private yAxisLabel: string
	private datasetId: string
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
		this.datasetId = config.datasetId || "measurement";
		this.color = config.color || "orange";
		this.plotStartsWithZero = config.plotStartsWithZero || false;
		this.defaultTimeSpan = config.defaultTimeSpan || 60 * 1000; // one minute
		this.defaultStartTime = config.defaultStartTime || new Date();
		this.defaultYDomain = config.defaultYDomain || [0, 1];
		this.yDomainEnlargement = config.yDomainEnlargement || 0.1;

		this.dataPoints = [];
		this.plot = new CanvasTimeSeriesPlot(d3version3.select(domContainer), [this.width, this.height], {
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
		this.plot.removeDataSet(this.datasetId);
		this.plot.addDataSet(this.datasetId, "", this.dataPoints, this.color, false, false);
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
			this.plot.addDataPoint(this.datasetId, dataPoint.toArray(), false, false);
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
			this.plot.updateDomains(xDomain.toArray(), this.plot.getYDomain(), false);
		} else {
			if (beforeCalculatedXDomain.end <= beforeActualXDomain.end && afterCalculatedXDomain.end > afterActualXDomain.end) {
				let shifting = afterCalculatedXDomain.end - beforeCalculatedXDomain.end;
				//TODO rework this
				var xDomain = new Domain(afterActualXDomain.start * 1 + shifting, afterActualXDomain.end * 1 + shifting);
				this.plot.updateDomains(xDomain.toDateArray(), this.plot.getYDomain(), false);
			}
		}
		this.updateDomains();
	}

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

class Domain {
	public constructor(public start: number, public end: number){}

	public getLength() {
		return this.end - this.start
	}

	public toArray() {
		return [this.start, this.end]
	}

	public toDateArray() {
		return [new Date(this.start), new Date(this.end)]
	}

	public static of(domain: Array<number>) {
		if (domain.length < 2) {
			new Error('Domain array must have at least two elements.')
		}
		return new Domain(domain[0], domain[1])
	}

}