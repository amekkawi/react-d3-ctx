"use strict";

import React from 'react';

const baseStyle = {
	shapeRendering: 'crispEdges',
};

const MouseRegionLine = React.createClass({
	getDefaultProps() {
		return {
			orient: 'vertical',
			seriesValuesAccessor: series => series.values,
			stroke: 'rgba(0,0,0,.25)',
			strokeWidth: 1,
		};
	},
	render() {
		const {
			className, orient,
			width, height, mouseOffsetX, mouseOffsetY,
			style, stroke, strokeWidth, strokeDasharray
			} = this.props;

		var x1, x2, y1, y2;
		if (orient === 'horizontal') {
			if (mouseOffsetY == null)
				return <line className={className} style={{ display: 'none' }} />

			y1 = y2 = mouseOffsetY;
			x1 = 0;
			x2 = width;
		}
		else {
			if (mouseOffsetX == null)
				return <line className={className} style={{ display: 'none' }} />

			x1 = x2 = mouseOffsetX;
			y1 = 0;
			y2 = height;
		}

		const lineStyle = style ? baseStyle : {
			...baseStyle,
			style
		};

		return <line
			className={className}
			x1={x1}
			y1={y1}
			x2={x2}
			y2={y2}
			stroke={stroke}
			strokeWidth={strokeWidth}
			strokeDasharray={strokeDasharray}
			style={lineStyle}/>
	}
});

export default React.createClass({
	displayName: 'MouseRegionLineCtx',
	contextTypes: {
		width: React.PropTypes.number.isRequired,
		height: React.PropTypes.number.isRequired,
		mouseOffsetX: React.PropTypes.number,
		mouseOffsetY: React.PropTypes.number,
	},
	render() {
		return <MouseRegionLine {...this.context} {...this.props} />
	}
});
