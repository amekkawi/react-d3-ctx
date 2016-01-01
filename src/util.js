"use strict";

import d3 from 'd3';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export function createScale(values, range) {
	var scale = values.length > 0 && isDate(values[0])
		? d3.time.scale()
		: d3.scale.linear();
	if (range) scale.range(range);
	return scale.domain(d3.extent(values));
}

export function calculateScales(chartWidth, chartHeight, xValues, yValues) {
	return {
		xScale: createScale(xValues, [0, chartWidth]),
		yScale: createScale(yValues, [chartHeight, 0])
	};
}

export function getInheritableProp(component, prop) {
	return component.props[prop] != null
		? component.props[prop]
		: component.context[prop];
}

export function isDate(d) {
	return Object.prototype.toString.call(d) === '[object Date]';
}

export function wrapAsPure(Component, displayName) {
	return React.createClass({
		displayName: displayName,
		mixins: [PureRenderMixin],
		render() {
			return <Component {...this.props} />
		}
	});
}

export function wrapForContext(Component, displayName, types) {
	return React.createClass({
		displayName: displayName,
		contextTypes: types,
		render() {
			return <Component {...this.context} {...this.props} />
		}
	});
}
