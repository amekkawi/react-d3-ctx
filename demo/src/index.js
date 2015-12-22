"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

import {
	Region, Align,
	AxisLine, TickMarks, TickLabels,
	Paths, Circles,
	XScale, YScale, PointData
} from '../../src/index';

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
		const {colors, width, height, margins} = this.props;
		const chartWidth = width - margins.left - margins.right;
		const chartHeight = height - margins.top - margins.bottom;
		const chartTransform = `translate(${margins.left},${margins.top})`;
		const lineData = [
			{
				name: 'Alpha',
				values: [
					{ x: 0, y: 0 },
					{ x: 1, y: 30 },
					{ x: 2, y: 60 },
					{ x: 3, y: 150 },
					{ x: 4, y: 30 },
					{ x: 5, y: 60 },
					{ x: 6, y: 150 },
					{ x: 7, y: 120 }
				]
			},
			{
				name: 'Beta',
				values: [
					{ x: 0, y: 13 },
					{ x: 1, y: 20 },
					{ x: 2, y: 80 },
					{ x: 3, y: 20 },
					{ x: 4, y: 30 },
					{ x: 5, y: 20 },
					{ x: 6, y: 80 },
					{ x: 7, y: 20 }
				]
			}
		];

		return (
			<svg className="rd3-chart" width={width} height={height}>
				<Region className="rd3-chartregion" width={chartWidth} height={chartHeight} transform={chartTransform}>
					<PointData data={lineData}>
						<Paths stroke={(series, idx) => colors(idx)} strokeWidth={1.25} />
						<Align className="rd3-xaxis" orient="bottom">
							<AxisLine
								tickSize={4}
								/>
							<TickMarks
								ticks={20}
								tickSize={4}
								/>
							<TickLabels
								ticks={20}
								labelStyle={{ fontSize: 12 }}
								tickSize={5}
								/>
						</Align>
						<Align className="rd3-yaxis" orient="left">
							<AxisLine
								tickSize={4}
							/>
							<TickMarks
								tickSize={4}
							/>
							<TickLabels
								labelStyle={{ fontSize: 12 }}
								tickSize={5}
							/>
						</Align>
					</PointData>
				</Region>
			</svg>
		)
	}
});

ReactDOM.render(
	<LineChart/>,
	document.getElementById('LineChart')
);
