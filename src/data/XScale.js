"use strict";

import React from 'react';
import {getInheritableProp, calculateScale} from '../util.js';

export default React.createClass({
	displayName: 'XScale',
	getDefaultProps() {
		return {
			className: 'rd3-xscale',
		};
	},
	contextTypes: {
		width: React.PropTypes.number,
		xValues: React.PropTypes.array,
	},
	childContextTypes: {
		xScale: React.PropTypes.func,
	},
	getChildContext() {
		const width = getInheritableProp(this, 'width');
		const xValues = getInheritableProp(this, 'xValues');
		return {
			xScale: calculateScale(width, xValues)
		};
	},
	render() {
		return <g className={this.props.className}>{this.props.children}</g>
	}
});
