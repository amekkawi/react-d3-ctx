"use strict";

import d3 from 'd3';
import React from 'react';

const AxisLine = React.createClass({
	propTypes: {
		scale: React.PropTypes.func.isRequired,
		orient: React.PropTypes.oneOf(['top', 'bottom', 'left', 'right']).isRequired,
		className: React.PropTypes.string,
		tickSize: React.PropTypes.number,
		stroke: React.PropTypes.string,
		style: React.PropTypes.object,
	},
	getDefaultProps() {
		return {
			className: 'rd3-axis-line',
			tickSize: 6,
			stroke: '#000',
			strokeWidth: 1,
		};
	},
	render() {
		const {className, orient, scale, tickSize, stroke, strokeWidth, style} = this.props;
		const orientFlip = orient === "top" || orient === "left" ? -1 : 1;
		const range = scale.rangeExtent ? scale.rangeExtent() : scale.range();
		const d = orient === "bottom" || orient === "top"
			? "M" + range[0] + "," + orientFlip * tickSize + "V0H" + range[1] + "V" + orientFlip * tickSize
			: "M" + orientFlip * tickSize + "," + range[0] + "H0V" + range[1] + "H" + orientFlip * tickSize;

		return <path
			className={className}
			d={d}
			fill="none"
			stroke={stroke}
			strokeWidth={strokeWidth}
			shapeRendering="crispEdges"
			style={style} />
	}
});

export default React.createClass({
	contextTypes: {
		orient: React.PropTypes.oneOf(['top', 'bottom', 'left', 'right']).isRequired,
		xScale: React.PropTypes.func,
		yScale: React.PropTypes.func,
	},
	render() {
		const {xScale, yScale, orient} = this.context;
		const scale = orient === 'top' || orient === 'bottom' ? xScale : yScale;
		return <AxisLine scale={scale} orient={orient} {...this.props} />
	}
});
