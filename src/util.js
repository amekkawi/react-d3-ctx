"use strict";

import d3 from 'd3';

export function calculateScale(rangeEnd, values) {
	var scale;
	if (values.length > 0 && isDate(values[0])) {
		scale = d3.time.scale().range([0, rangeEnd]);
	}
	else {
		scale = d3.scale.linear().range([0, rangeEnd]);
	}
	return scale.domain(d3.extent(values));
}

export function calculateScales(chartWidth, chartHeight, xValues, yValues) {
	return {
		xScale: calculateScale(chartWidth, xValues),
		yScale: calculateScale(chartHeight, yValues)
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
