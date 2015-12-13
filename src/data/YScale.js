"use strict";

import React from 'react';
import {contextProp, calculateScale} from '../util.js';

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
		const height = contextProp(this, 'height');
		const yValues = contextProp(this, 'yValues');
		return {
			yScale: calculateScale(height, yValues)
		};
	},
	render() {
		return <g className={this.props.className}>{this.props.children}</g>
	}
});
