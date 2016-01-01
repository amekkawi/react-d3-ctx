"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

require('style!css!less!./style.less');

import {
	Region, Align,
	AxisLine, TickMarks, TickLabels, TickGrid,
	Voronoi, MouseMove, MouseLine,
	Paths, Circles,
	XScale, YScale, PointData
} from '../../src/index';

import {simplePoints, randomPoints} from './data';

export const LineChart = React.createClass({
	getDefaultProps() {
		return {
			colors: d3.scale.category10(),
			height: 300,
			width: 600,
			margins: { top: 10, right: 20, bottom: 50, left: 45 }
		};
	},
	componentWillUpdate() {
		this._startRender = new Date().getTime();
	},
	componentDidUpdate() {
		console.info('Chart Re-Render', (new Date().getTime() - this._startRender).toFixed() + 'ms');
	},
	render() {
		const {colors, width, height, margins, data} = this.props;
		const chartWidth = width - margins.left - margins.right;
		const chartHeight = height - margins.top - margins.bottom;
		const chartTransform = `translate(${margins.left},${margins.top})`;
		return (
			<svg className="rd3-chart" width={width} height={height}>
				<Region className="rd3-chartregion" width={chartWidth} height={chartHeight} transform={chartTransform}>
					<PointData data={data}>
						<TickGrid orient="horizontal"/>
						<Paths stroke={(series, idx) => colors(idx)} strokeWidth={series => series.strokeWidth || 1} />
						<Align className="rd3-xaxis" orient="bottom">
							<AxisLine tickSize={4}/>
							<TickMarks ticks={20} tickSize={4}/>
							<TickLabels ticks={20} labelStyle={{ fontSize: 12 }}/>
						</Align>
						<Align className="rd3-yaxis" orient="left">
							<AxisLine tickSize={4}/>
							<TickMarks tickSize={4}/>
							<TickLabels tickSize={5} labelStyle={{ fontSize: 12 }} tickSize={7}/>
						</Align>
						<MouseMove className="rd3-chartregion">
							<MouseLine />
						</MouseMove>
					</PointData>
				</Region>
			</svg>
		)
	}
});

ReactDOM.render(
	<LineChart data={simplePoints}/>,
	document.getElementById('LineChart')
);

const PlotChartCircles = React.createClass({
	getInitialState() {
		return {};
	},
	handleNodeOver(nodeData) {
		this.setState(nodeData.values.reduce((ret, value) => {
			ret[`${value.idx}:${value.idv}`] = true;
			return ret;
		}, {}));
	},
	handleNodeOut(nodeData) {
		this.setState(nodeData.values.reduce((ret, value) => {
			ret[`${value.idx}:${value.idv}`] = false;
			return ret;
		}, {}));
	},
	render() {
		const {colors} = this.props;
		const state = this.state;
		return (
			<g>
				<Circles
					circleRadius={(series, idx, idv) => state[`${idx}:${idv}`] ? 3 : 2.5}
					fill={(series, idx, idv) => state[`${idx}:${idv}`] ? '#FFF' : colors(idx)}
					stroke={(series, idx, idv) => state[`${idx}:${idv}`] ? colors(idx) : null}
					strokeWidth="2"/>
				<Voronoi.Pure
					className="circle-mouseover"
					onNodeOver={this.handleNodeOver}
					onNodeOut={this.handleNodeOut}/>
			</g>
		)
	}
});

const PlotChart = React.createClass({
	getDefaultProps() {
		return {
			colors: d3.scale.category10(),
			height: 300,
			width: 600,
			margins: { top: 10, right: 20, bottom: 50, left: 45 }
		};
	},
	componentWillUpdate() {
		this._startRender = new Date().getTime();
	},
	componentDidUpdate() {
		console.info('Chart Re-Render', (new Date().getTime() - this._startRender).toFixed() + 'ms');
	},
	render() {
		const {colors, width, height, margins, data} = this.props;
		const chartWidth = width - margins.left - margins.right;
		const chartHeight = height - margins.top - margins.bottom;
		const chartTransform = `translate(${margins.left},${margins.top})`;
		return (
			<svg className="rd3-chart" width={width} height={height}>
				<Region className="rd3-chartregion" width={chartWidth} height={chartHeight} transform={chartTransform}>
					<PointData data={data}>
						<TickGrid orient="horizontal"/>
						<Align className="rd3-xaxis" orient="bottom">
							<AxisLine tickSize={4}/>
							<TickMarks ticks={20} tickSize={4}/>
							<TickLabels ticks={20} labelStyle={{ fontSize: 12 }}/>
						</Align>
						<Align className="rd3-yaxis" orient="left">
							<AxisLine tickSize={4}/>
							<TickMarks tickSize={4}/>
							<TickLabels tickSize={5} labelStyle={{ fontSize: 12 }} tickSize={7}/>
						</Align>
						<PlotChartCircles colors={colors}/>
					</PointData>
				</Region>
			</svg>
		)
	}
});

ReactDOM.render(
	<PlotChart data={randomPoints}/>,
	document.getElementById('LineChartRand')
);
