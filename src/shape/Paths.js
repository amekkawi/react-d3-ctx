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

export const Paths = React.createClass({
	propTypes: {
		className: React.PropTypes.string,
		data: React.PropTypes.array,
		seriesValuesAccessor: React.PropTypes.func,
		stroke: React.PropTypes.oneOfType([
			React.PropTypes.func,
			React.PropTypes.string
		]),
		fill: React.PropTypes.oneOfType([
			React.PropTypes.func,
			React.PropTypes.string
		]),
		interpolationType: React.PropTypes.string,
		xScale: React.PropTypes.func,
		yScale: React.PropTypes.func,
		xAccessor: React.PropTypes.func,
		yAccessor: React.PropTypes.func,
		pathClassName: React.PropTypes.oneOfType([
			React.PropTypes.func,
			React.PropTypes.string
		]),
		pathStyle: React.PropTypes.oneOfType([
			React.PropTypes.func,
			React.PropTypes.string
		]),
		strokeWidth: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.number
		]),
		strokeDasharray: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.number
		])
	},
	getDefaultProps() {
		return {
			className: 'rd3-paths',
			data: [],
			seriesValuesAccessor: series => series.values,
			stroke: 'rgba(31, 119, 180, .75)',
			fill: 'none',
			interpolationType: 'linear',
			strokeWidth: 2,
		};
	},
	render() {
		const {
			className, data, seriesValuesAccessor,
			xScale, yScale, xAccessor, yAccessor,
			stroke, fill, interpolationType,
			pathClassName, pathStyle, strokeWidth, strokeDasharray,
			} = this.props;

		const strokeFn = stroke && typeof stroke === 'function' || null;
		const strokeWidthFn = strokeWidth && typeof strokeWidth === 'function' || null;
		const fillFn = fill && typeof fill === 'function' || null;
		const pathStyleFn = pathStyle && typeof pathStyle === 'function' || null;
		const pathClassNameFn = pathClassName && typeof pathClassName === 'function';

		var interpolatePath = d3.svg.line()
			.x(xAccessor ? d => xScale(xAccessor(d)) : d => xScale(d.x))
			.y(yAccessor ? d => yScale(yAccessor(d)) : d => yScale(d.y))
			.interpolate(interpolationType);

		return (
			<g className={className}
			   strokeDasharray={strokeDasharray}
			   fill={fillFn ? null : fill}
			   stroke={strokeFn ? null : stroke}
			   strokeWidth={strokeWidthFn ? null : strokeWidth}
			   style={pathStyleFn ? null : pathStyle}>
				{data.map((series, idx) => <path
					key={idx}
					className={pathClassNameFn ? pathClassName(series, idx) : pathClassName}
					d={interpolatePath(seriesValuesAccessor(series))}
					fill={fillFn && fill(series, idx)}
					stroke={strokeFn && stroke(series, idx)}
					strokeWidth={strokeWidthFn && strokeWidth(series, idx)}
					style={pathStyleFn && pathStyle(series, idx)}
				/>)}
			</g>
		)
	}
});

export const PathsCtx = wrapForContext(Paths, 'PathsCtx', contextTypes);

Paths.Pure = wrapAsPure(Paths, 'PathsPure');
PathsCtx.Pure = wrapForContext(Paths.Pure, 'PathsPureCtx', contextTypes);

export default PathsCtx;
