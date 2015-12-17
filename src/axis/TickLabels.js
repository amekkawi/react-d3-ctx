"use strict";

import React from 'react';

const TickLabels = React.createClass({
	propTypes: {
		scale: React.PropTypes.func.isRequired,
		orient: React.PropTypes.oneOf(['top', 'bottom', 'left', 'right']).isRequired,
		className: React.PropTypes.string,
		ticks: React.PropTypes.oneOfType([
			React.PropTypes.arrayOf(React.PropTypes.number),
			React.PropTypes.number,
			React.PropTypes.func,
		]),
		fill: React.PropTypes.string,
		stroke: React.PropTypes.string,
		strokeWidth: React.PropTypes.number,
		tickSize: React.PropTypes.number,
		labelStyle: React.PropTypes.object,
		format: React.PropTypes.func,
	},
	getDefaultProps() {
		return {
			className: 'rd3-ticklabels',
			ticks: 10,
			tickSize: 7,
			stroke: '#FFF',
			fill: '#000',
			strokeWidth: 0,
			format: v => v,
		}
	},
	getTicks() {
		var {ticks, scale} = this.props;

		if (typeof ticks === 'function') {
			ticks = ticks(this.props);
		}

		if (typeof ticks === 'number') {
			ticks = scale.ticks
				? scale.ticks(ticks)
				: scale.domain();
		}

		return ticks;
	},
	render() {
		const ticks = this.getTicks();
		const {className, scale, orient, format, tickSize, fill, stroke, strokeWidth, labelStyle} = this.props;

		const adjustedScale = scale.rangeBand
			? d => scale(d) + scale.rangeBand() / 2
			: scale;

		var orientFlip = 1, tr, dy, textAnchor;
		switch (orient) {
			case 'top':
				orientFlip = -1;
			case 'bottom':
				dy = orientFlip < 0 ? '0em' : '.71em';
				tr = tick => `translate(${adjustedScale(tick)},${tickSize * orientFlip})`;
				textAnchor = 'middle';
				break;
			case 'left':
				dy = '.32em';
				orientFlip = -1;
			case 'right':
				tr = tick => `translate(${tickSize * orientFlip},${adjustedScale(tick)})`;
				textAnchor = orient === 'left' ? 'end' : 'start';
				break;
		}

		return (
			<g className={className}
			   fill={fill}
			   stroke={stroke}
			   strokeWidth={strokeWidth}
			   textAnchor={textAnchor}
			   style={labelStyle}>

				{ticks.map((tick, idx) =>
					<text key={idx} transform={tr(tick)} dy={dy}>
						{format(tick)}
					</text>
				)}
			</g>
		)
	}
});

export default React.createClass({
	displayName: 'TickLabelsCtx',
	contextTypes: {
		xScale: React.PropTypes.func,
		yScale: React.PropTypes.func,
		orient: React.PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
	},
	render() {
		const {xScale, yScale, orient} = this.context;
		const scale = orient === 'top' || orient === 'bottom' ? xScale : yScale;
		return <TickLabels scale={scale} orient={orient} {...this.props} />
	}
});
