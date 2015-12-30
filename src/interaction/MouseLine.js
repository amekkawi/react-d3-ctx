"use strict";

import React from 'react';

const baseStyle = {
	shapeRendering: 'crispEdges',
};

const MouseLine = React.createClass({
	propTypes: {
		width: React.PropTypes.number.isRequired,
		height: React.PropTypes.number.isRequired,
		mouseUserX: React.PropTypes.number,
		mouseUserY: React.PropTypes.number,
		orient: React.PropTypes.oneOf(['horizontal', 'vertical']),
		className: React.PropTypes.string,
		stroke: React.PropTypes.string,
		strokeWidth: React.PropTypes.oneOfType([
			React.PropTypes.number,
			React.PropTypes.string
		]),
		strokeDasharray: React.PropTypes.string,
	},
	getDefaultProps() {
		return {
			orient: 'vertical',
			stroke: 'rgba(0,0,0,.25)',
			strokeWidth: 1,
		};
	},
	render() {
		const {
			className, orient,
			width, height, mouseUserX, mouseUserY,
			style, stroke, strokeWidth, strokeDasharray
			} = this.props;

		var x1, x2, y1, y2;
		if (orient === 'horizontal') {
			if (mouseUserY == null)
				return <line className={className} style={{ display: 'none' }} />

			y1 = y2 = mouseUserY;
			x1 = 0;
			x2 = width;
		}
		else {
			if (mouseUserX == null)
				return <line className={className} style={{ display: 'none' }} />

			x1 = x2 = mouseUserX;
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
	displayName: 'MouseLineCtx',
	contextTypes: {
		width: React.PropTypes.number.isRequired,
		height: React.PropTypes.number.isRequired,
		mouseUserX: React.PropTypes.number,
		mouseUserY: React.PropTypes.number,
	},
	render() {
		return <MouseLine {...this.context} {...this.props} />
	}
});
