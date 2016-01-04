"use strict";

import React from 'react';
import {getTicks, getTickValues, getTickFormat} from '../common/ticks';

const TickLabels = React.createClass({
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
		fill: React.PropTypes.string,
		stroke: React.PropTypes.string,
		strokeWidth: React.PropTypes.number,
		tickSize: React.PropTypes.number,
		tickPadding: React.PropTypes.number,
		labelStyle: React.PropTypes.object,
		format: React.PropTypes.func,
	},
	getDefaultProps() {
		return {
			className: 'rd3-ticklabels',
			ticks: 10,
			tickSize: 6,
			tickPadding: 3,
			stroke: '#FFF',
			fill: '#000',
			strokeWidth: 0,
		}
	},
	getTicks,
	getTickValues,
	getTickFormat,
	render() {
		const {
			className, scale, orient, tickSize, tickPadding,
			fill, stroke, strokeWidth, labelStyle
			} = this.props;

		const ticks = this.getTicks();
		const tickValues = this.getTickValues({ticks});
		const tickFormat = this.getTickFormat({ticks});

		const adjustedScale = scale.rangeBand
			? d => scale(d) + scale.rangeBand() / 2
			: scale;

		const tickOffset = tickSize + tickPadding;
		var orientFlip = 1, tr, dy, textAnchor;
		switch (orient) {
			case 'top':
				orientFlip = -1;
			case 'bottom':
				dy = orientFlip < 0 ? '0em' : '.71em';
				tr = tick => `translate(${adjustedScale(tick)},${tickOffset * orientFlip})`;
				textAnchor = 'middle';
				break;
			case 'left':
				dy = '.32em';
				orientFlip = -1;
			case 'right':
				tr = tick => `translate(${tickOffset * orientFlip},${adjustedScale(tick)})`;
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

				{tickValues.map((tick, idx) =>
					<text key={idx} transform={tr(tick)} dy={dy}>
						{tickFormat(tick)}
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
