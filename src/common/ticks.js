"use strict";

export const globalDefaultFormat = v => v;

export function getTicks() {
	const {ticks} = this.props;
	return typeof ticks === 'function'
		? ticks(this.props)
		: ticks;
}

export function getTickValues({ticks, scale, tickValues}) {
	tickValues = tickValues || this.props.tickValues;
	if (tickValues)
		return tickValues;

	scale = scale || this.props.scale;
	if (!scale.ticks)
		return scale.domain();

	ticks = ticks == null
		? this.getTicks ? this.getTicks() : this.props.ticks
		: ticks;
	return typeof ticks === 'number'
		? scale.ticks(ticks)
		: scale.ticks.apply(scale, ticks || []);
}

export function getTickFormat({ticks, scale, format, defaultFormat = globalDefaultFormat}) {
	format = format || this.props.format;
	if (typeof format === 'function')
		return format;

	scale = scale || this.props.scale;
	if (!scale.tickFormat)
		return defaultFormat;

	ticks = ticks == null
		? this.getTicks ? this.getTicks() : this.props.ticks
		: ticks;
	return typeof ticks === 'number'
		? scale.tickFormat(ticks)
		: scale.tickFormat.apply(scale, ticks || []);
}

export default {
	getTicks,
	getTickValues,
	getTickFormat
};
