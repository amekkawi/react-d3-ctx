"use strict";

import React from 'react';
import {getTicks, getTickValues, getTickFormat} from '../common/ticks';

const baseStyle = {
	shapeRendering: 'crispEdges'
};

const TickMarks = React.createClass({
	propTypes: {
		scale: React.PropTypes.func.isRequired,
		orient: React.PropTypes.oneOf(['top', 'bottom', 'left', 'right']).isRequired,
		className: React.PropTypes.string,
		ticks: React.PropTypes.oneOfType([
			React.PropTypes.func,
			React.PropTypes.number,
			React.PropTypes.array,
		]),
		tickValues: React.PropTypes.array,
		tickSize: React.PropTypes.number,
		stroke: React.PropTypes.string,
		strokeWidth: React.PropTypes.number,
		tickStyle: React.PropTypes.object,
	},
	getDefaultProps() {
		return {
			className: 'rd3-ticks',
			ticks: 10,
			tickSize: 6,
			stroke: '#000',
			strokeWidth: 1,
		}
	},
	getTicks,
	getTickValues,
	getTickFormat,
	render() {
		const {className, scale, orient, tickSize, stroke, strokeWidth, tickStyle} = this.props;
		const orientFlip = orient === 'top' || orient === 'right' ? -1 : 1;
		const tickValues = this.getTickValues({scale});
		const adjustedScale = scale.rangeBand
			? d => scale(d) + scale.rangeBand() / 2
			: scale;

		var tr, y2, x2;
		switch (orient) {
			case 'top':
			case 'bottom':
				tr = tick => `translate(${adjustedScale(tick)},0)`;
				y2 = tickSize * orientFlip;
				break;
			case 'left':
			case 'right':
				tr = tick => `translate(0,${adjustedScale(tick)})`;
				x2 = tickSize * -orientFlip;
				break;
		}

		const style = tickStyle ? {
			...baseStyle,
			...tickStyle,
		} : baseStyle;

		return (
			<g className={className}
			   opacity="1"
			   stroke={stroke}
			   strokeWidth={strokeWidth}
			   style={style}>
				{tickValues.map((tick, idx) =>
					<line
						key={idx}
						transform={tr(tick)}
						x2={x2}
						y2={y2}/>
				)}
			</g>
		)
	}
});

export default React.createClass({
	displayName: 'TickMarksCtx',
	contextTypes: {
		xScale: React.PropTypes.func,
		yScale: React.PropTypes.func,
		orient: React.PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
	},
	render() {
		const {xScale, yScale, orient} = this.context;
		const scale = orient === 'top' || orient === 'bottom' ? xScale : yScale;
		return <TickMarks scale={scale} orient={orient} {...this.props} />
	}
});
