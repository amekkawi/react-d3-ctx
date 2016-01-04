"use strict";

import React from 'react';
import {getTicks, getTickValues, getTickFormat} from '../common/ticks';

const baseStyle = {
	shapeRendering: 'crispEdges'
};

const TickGrid = React.createClass({
	propTypes: {
		xScale: React.PropTypes.func.isRequired,
		yScale: React.PropTypes.func.isRequired,
		orient: React.PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
		className: React.PropTypes.string,
		ticks: React.PropTypes.oneOfType([
			React.PropTypes.func,
			React.PropTypes.number,
			React.PropTypes.array,
		]),
		tickValues: React.PropTypes.array,
		stroke: React.PropTypes.string,
		strokeWidth: React.PropTypes.number,
		strokeDasharray: React.PropTypes.string,
		tickStyle: React.PropTypes.object,
	},
	getDefaultProps() {
		return {
			className: 'rd3-tickgrid',
			ticks: 10,
			stroke: '#DDD',
			strokeWidth: 1,
			strokeDasharray: '3,5',
		}
	},
	getTicks,
	getTickValues,
	getTickFormat,
	render() {
		const {className, xScale, yScale, orient, stroke, strokeWidth, strokeDasharray, lineStyle} = this.props;
		const scale = orient === 'horizontal' ? yScale : xScale;
		const tickValues = this.getTickValues({scale});

		const adjustedScale = scale.rangeBand
			? d => scale(d) + scale.rangeBand() / 2
			: scale;

		const style = lineStyle ? {
			...baseStyle,
			...lineStyle,
		} : baseStyle;

		var x1, y1, x2, y2, tr;
		if (orient === 'horizontal') {
			const xRange = xScale.range();
			x1 = Math.min(xRange[0], xRange[1]);
			x2 = Math.max(xRange[0], xRange[1]);
			tr = tick => `translate(0,${adjustedScale(tick)})`;
		}
		else {
			const yRange = yScale.range();
			y1 = Math.min(yRange[0], yRange[1]);
			y2 = Math.max(yRange[0], yRange[1]);
			tr = tick => `translate(${adjustedScale(tick)},0)`;
		}

		return (
			<g className={className}
			   opacity="1"
			   stroke={stroke}
			   strokeWidth={strokeWidth}
			   strokeDasharray={strokeDasharray}
			   style={style}>
				{tickValues.map((tick, idx) =>
					<line
						key={idx}
						x1={x1}
						y1={y1}
						x2={x2}
						y2={y2}
						transform={tr(tick)}/>
				)}
			</g>
		)
	}
});

export default React.createClass({
	contextTypes: {
		xScale: React.PropTypes.func,
		yScale: React.PropTypes.func,
		orient: React.PropTypes.oneOf(['horizontal', 'vertical']),
	},
	render() {
		return <TickGrid {...this.context} {...this.props} />
	}
});
