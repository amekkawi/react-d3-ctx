"use strict";

import d3 from 'd3';
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

export const Circles = React.createClass({
	propTypes: {
		xScale: React.PropTypes.func.isRequired,
		yScale: React.PropTypes.func.isRequired,
		className: React.PropTypes.string,
		data: React.PropTypes.array,
		seriesValuesAccessor: React.PropTypes.func,
		stroke: React.PropTypes.oneOfType([
			React.PropTypes.func,
			React.PropTypes.string
		]),
		strokeWidth: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.number,
			React.PropTypes.func
		]),
		fill: React.PropTypes.oneOfType([
			React.PropTypes.func,
			React.PropTypes.string
		]),
		xAccessor: React.PropTypes.func,
		yAccessor: React.PropTypes.func,
		circleClassName: React.PropTypes.oneOfType([
			React.PropTypes.func,
			React.PropTypes.string
		]),
		circleRadius: React.PropTypes.oneOfType([
			React.PropTypes.func,
			React.PropTypes.string,
			React.PropTypes.number
		])
	},
	getDefaultProps() {
		return {
			className: 'rd3-circles',
			data: [],
			seriesValuesAccessor: series => series.values,
			fill: 'rgba(31, 119, 180, .75)',
			stroke: 'none',
			circleRadius: 3,
		};
	},
	render() {
		const {
			className, data, xScale, yScale,
			seriesValuesAccessor, xAccessor, yAccessor,
			stroke, fill, strokeWidth,
			circleClassName, circleRadius
			} = this.props;

		const strokeFn = stroke && typeof stroke === 'function' || null;
		const strokeWidthFn = strokeWidth && typeof strokeWidth === 'function' || null;
		const fillFn = fill && typeof fill === 'function' || null;
		const circleClassNameFn = typeof circleClassName === 'function' || null;
		const circleRadiusFn = typeof circleRadius === 'function' || null;

		return (
			<g className={className}
			   fill={fillFn ? null : fill}
			   stroke={strokeFn ? null : stroke}
			   strokeWidth={strokeWidthFn ? null : strokeWidth}>
				{data.map((series, idx) =>
					seriesValuesAccessor(series).map((value, idv) =>
						<circle
							className={circleClassNameFn ? circleClassName(series, idx, idv) : circleClassName}
							r={circleRadiusFn ? circleRadius(series, idx, idv) : circleRadius}
							fill={fillFn && fill(series, idx, idv)}
							stroke={strokeFn && stroke(series, idx, idv)}
							strokeWidth={strokeWidthFn && strokeWidth(series, idx, idv)}
							cx={xScale(xAccessor ? xAccessor(value) : value.x)}
							cy={yScale(yAccessor ? yAccessor(value) : value.y)}
						/>
					))}
			</g>
		);
	}
});

export const CirclesCtx = wrapForContext(Circles, 'CirclesCtx', contextTypes);

Circles.Pure = wrapAsPure(Circles, 'CirclesPure');
CirclesCtx.Pure = wrapForContext(Circles.Pure, 'CirclesPureCtx', contextTypes);

export default CirclesCtx;
