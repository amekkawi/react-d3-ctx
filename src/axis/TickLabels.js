"use strict";

import React from 'react';

const TickLabels = React.createClass({
	propTypes: {
		scale: React.PropTypes.func.isRequired,
		orient: React.PropTypes.oneOf(['top', 'bottom', 'left', 'right']).isRequired,
		className: React.PropTypes.string,
		ticks: React.PropTypes.oneOfType([
			React.PropTypes.arrayOf(React.PropTypes.number),
			React.PropTypes.number
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
	render() {
		var {ticks} = this.props;
		const {className, scale, orient, format, tickSize, fill, stroke, strokeWidth} = this.props;

		if (typeof ticks === 'number') {
			ticks = scale.ticks
				? scale.ticks(ticks)
				: scale.domain();
		}

		const adjustedScale = scale.rangeBand
			? d => scale(d) + scale.rangeBand() / 2
			: scale;

		var orientFlip = 1, tr, textAnchor, dominantBaseline;
		switch (orient) {
			case 'top':
				orientFlip = -1;
			case 'bottom':
				tr = tick => `translate(${adjustedScale(tick)},${tickSize * orientFlip})`;
				textAnchor = 'middle';
				dominantBaseline = orient === 'top' ? null : 'hanging';
				break;
			case 'left':
				orientFlip = -1;
			case 'right':
				tr = tick => `translate(${tickSize * orientFlip},${adjustedScale(tick)})`;
				dominantBaseline = 'central';
				textAnchor = orient === 'left' ? 'end' : 'start';
				break;
		}

		const labelStyle = {
			dominantBaseline,
			...this.props.labelStyle,
		};

		return (
			<g className={className}
			   fill={fill}
			   stroke={stroke}
			   strokeWidth={strokeWidth}
			   textAnchor={textAnchor}
			   style={labelStyle}>

				{ticks.map((tick, idx) =>
					<text key={idx} transform={tr(tick)}>
						{format(tick)}
					</text>
				)}
			</g>
		)
	}
});

export default React.createClass({
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
