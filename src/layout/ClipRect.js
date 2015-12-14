"use strict";

import React from 'react';
import {getInheritableProp} from '../util';

export default React.createClass({
	className: 'ClipRect',
	contextTypes: {
		width: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.number
		]),
		height: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.number
		]),
	},
	propTypes: {
		id: React.PropTypes.string.isRequired,
		x: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.number
		]),
		y: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.number
		]),
		width: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.number
		]),
		height: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.number
		]),
		offsetWidth: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.number
		]),
		offsetHeight: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.number
		]),
	},
	getDefaultProps() {
		return {
			x: 0,
			y: 0,
			offsetWidth: 0,
			offsetHeight: 0
		};
	},
	render() {
		const {id, x, y, offsetWidth, offsetHeight} = this.props;
		const width = getInheritableProp(this, 'width');
		const height = getInheritableProp(this, 'height');
		return <defs>
			<clipPath id={id}>
				<rect x={x} y={y} width={width + offsetWidth} height={height + offsetHeight} />
			</clipPath>
		</defs>
	}
});
