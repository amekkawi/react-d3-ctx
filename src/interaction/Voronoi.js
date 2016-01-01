"use strict";

import React from 'react';
import {wrapAsPure, wrapForContext} from '../util';

const contextTypes = {
	data: React.PropTypes.array,
	seriesValuesAccessor: React.PropTypes.func,
	xScale: React.PropTypes.func,
	yScale: React.PropTypes.func,
	xAccessor: React.PropTypes.func,
	yAccessor: React.PropTypes.func,
};

export const Voronoi = React.createClass({
	propTypes: {
		className: React.PropTypes.string,
		data: React.PropTypes.array,
		seriesValuesAccessor: React.PropTypes.func,
		xScale: React.PropTypes.func,
		yScale: React.PropTypes.func,
		xAccessor: React.PropTypes.func,
		yAccessor: React.PropTypes.func,
		pathStyle: React.PropTypes.object,
		onNodeOver: React.PropTypes.func,
		onNodeOut: React.PropTypes.func,
	},
	getDefaultProps() {
		return {
			className: 'rd3-voronoi',
			data: [],
			seriesValuesAccessor: series => series.values,
			buildKey: ({x, y}) => `${x}:${y}`,
		};
	},
	handleMouseOver(data) {
		const {onNodeOver} = this.props;
		if (onNodeOver)
			onNodeOver(data);
	},
	handleMouseOut(data) {
		const {onNodeOut} = this.props;
		if (onNodeOut)
			onNodeOut(data);
	},
	createPoints() {
		const {
			data, seriesValuesAccessor,
			xScale, yScale, xAccessor, yAccessor,
			buildKey
			} = this.props;

		const pointsMap = {};
		const points = [];
		data.forEach((series, idx) => {
			seriesValuesAccessor(series).forEach((value, idv) => {
				const x = xAccessor ? xAccessor(value) : value.x;
				const y = yAccessor ? yAccessor(value) : value.y;

				if (x == null || y == null || isNaN(x) || isNaN(y))
					return;

				const key = buildKey({x, y}, {xScale, yScale});
				var pointsMapEntry = pointsMap[key];
				if (!pointsMapEntry) {
					points.push(pointsMapEntry = pointsMap[key] = {
						x,
						y,
						key,
						values: []
					});
				}

				pointsMapEntry.values.push({
					series,
					idx,
					value,
					idv
				});
			});
		});

		return {
			map: pointsMap,
			points: points
		};
	},
	render() {
		const {className, data, xScale, yScale, pathStyle} = this.props;
		const xRange = xScale.range();
		const yRange = yScale.range();

		var voronoi = d3.geom.voronoi()
			.x(d => xScale(d.x))
			.y(d => yScale(d.y))
			.clipExtent([
				[Math.min(xRange[0], xRange[1]), Math.min(yRange[0], yRange[1])],
				[Math.max(xRange[0], xRange[1]), Math.max(yRange[0], yRange[1])]
			]);

		const {points} = this.createPoints();

		return (
			<g className={className}>
				{data.map((series, idx) =>
					voronoi(points).map((vnode, i) => {
						if (!vnode.length)
							return;
						const path = 'M' + vnode.join(',') + 'Z';
						return <path
							key={i}
							fill='transparent'
							d={path}
							style={pathStyle}
							onMouseOver={this.handleMouseOver.bind(this, vnode.point)}
							onMouseOut={this.handleMouseOut.bind(this, vnode.point)}
						/>
					})
				)}
			</g>
		)
	}
});

export const VoronoiCtx = wrapForContext(Voronoi, 'VoronoiCtx', contextTypes);

Voronoi.Pure = wrapAsPure(Voronoi, 'VoronoiPure');
VoronoiCtx.Pure = wrapForContext(Voronoi.Pure, 'VoronoiPureCtx', contextTypes);

export default VoronoiCtx;
