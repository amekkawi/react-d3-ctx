"use strict";

import React from 'react';
import {getInheritableProp, createScale} from '../util.js';

export default React.createClass({
	displayName: 'YScale',
	getDefaultProps() {
		return {
			className: 'rd3-yscale',
		};
	},
	contextTypes: {
		height: React.PropTypes.number,
		yValues: React.PropTypes.array,
	},
	childContextTypes: {
		yScale: React.PropTypes.func,
	},
	getChildContext() {
		const height = getInheritableProp(this, 'height');
		const yValues = getInheritableProp(this, 'yValues');
		return {
			yScale: createScale(yValues, [height, 0])
		};
	},
	render() {
		return <g className={this.props.className}>{this.props.children}</g>
	}
});
