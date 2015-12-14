"use strict";

import React from 'react';
import {getInheritableProp, calculateScale} from '../util';

export default React.createClass({
	displayName: 'PointData',
	propTypes: {
		seriesValuesAccessor: React.PropTypes.func
	},
	contextTypes: {
		width: React.PropTypes.number,
		height: React.PropTypes.number,
		xScale: React.PropTypes.func,
		yScale: React.PropTypes.func,
	},
	getDefaultProps() {
		return {
			className: 'rd3-pointdata',
			data: [],
			seriesValuesAccessor: series => series.values,
			xAccessor: d => d.x,
			yAccessor: d => d.y,
		};
	},
	childContextTypes: {
		data: React.PropTypes.array,
		xScale: React.PropTypes.func,
		yScale: React.PropTypes.func,
	},
	getChildContext() {
		const width = getInheritableProp(this, 'width');
		const height = getInheritableProp(this, 'height');
		const yScale = getInheritableProp(this, 'yScale');
		const xScale = getInheritableProp(this, 'xScale');
		const {data} = this.props;
		const flatValues = this.flattenPointValues(data, !xScale, !yScale);
		return {
			data,
			xScale: xScale || calculateScale(width, flatValues.xValues),
			yScale: yScale || calculateScale(height, flatValues.yValues)
		};
	},
	flattenPointValues(doX, doY) {
		if (!doX && !doY)
			return;

		const {data, seriesValuesAccessor, xAccessor, yAccessor} = this.props;
		const xValues = [];
		const yValues = [];

		data.forEach((series, i) => {
			seriesValuesAccessor(series).forEach(value => {
				if (doX) {
					const x = xAccessor ? xAccessor(value) : value.x;
					if (x != null)
						xValues.push(x);
				}

				if (doY) {
					const y = xAccessor ? yAccessor(value) : value.y;
					if (y != null)
						yValues.push(y);
				}
			});
		});

		return {
			xValues,
			yValues
		};
	},
	render() {
		const {className, children} = this.props;
		return <g className={className}>{children}</g>;
	}
});
