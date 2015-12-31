"use strict";

import React from 'react';

const TickMarks = React.createClass({
	propTypes: {
		scale: React.PropTypes.func.isRequired,
		orient: React.PropTypes.oneOf(['top', 'bottom', 'left', 'right']).isRequired,
		className: React.PropTypes.string,
		ticks: React.PropTypes.oneOfType([
			React.PropTypes.arrayOf(React.PropTypes.number),
			React.PropTypes.number,
			React.PropTypes.func,
		]),
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
	render() {
		var {ticks} = this.props;
		const {className, scale, orient, tickSize, stroke, strokeWidth, tickStyle} = this.props;
		const orientFlip = orient === 'top' || orient === 'right' ? -1 : 1;

		if (typeof ticks === 'function') {
			ticks = ticks(this.props);
		}

		if (typeof ticks === 'number') {
			ticks = scale.ticks
				? scale.ticks(ticks)
				: scale.domain();
		}

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

		return (
			<g className={className}
			   opacity="1"
			   stroke={stroke}
			   strokeWidth={strokeWidth}
			   style={{ shapeRendering: 'crispEdges', ...tickStyle }}>
				{ticks.map((tick, idx) =>
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
