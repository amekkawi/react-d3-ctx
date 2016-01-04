"use strict";

import expect, {createSpy} from 'expect';
import mixin, {getTicks, getTickValues, getTickFormat, globalDefaultFormat} from '../../src/common/ticks';

describe('ticks', () => {
	describe('getTicks', () => {
		it('should execute this.props.ticks if function', () => {
			const spy = createSpy().andReturn(5);
			const fixture = {props: {ticks: spy}};
			expect(getTicks.call(fixture)).toBe(5, 'call as func');
			expect(spy.calls.length).toBe(1, 'only call once');
			expect(spy.calls[0].arguments.length).toBe(1, 'call fn with one arg');
			expect(spy.calls[0].arguments[0]).toBe(fixture.props, 'call fn with props as first arg');
		});
		it('should return this.props as-is if not a function', () => {
			expect(getTicks.call({props: {ticks: 5}})).toBe(5);
		});
	});

	describe('getTickValues', () => {
		it('should return tickValues if prop or arg', () => {
			const argTickValues = [0, 5, 10];
			const fixture = {props: {tickValues: [0, 2, 5]}};
			expect(getTickValues.call(fixture, {})).toBe(fixture.props.tickValues, 'from prop');
			expect(getTickValues.call(fixture, {tickValues: argTickValues})).toBe(argTickValues, 'from opts');
		});

		it('should return scale\'s domain if scale doesn\'t support ticks', () => {
			const argDomainVal = [200, 300];
			const propDomainVal = [200, 300];
			const argDomainSpy = createSpy().andReturn(argDomainVal);
			const propDomainSpy = createSpy().andReturn(propDomainVal);
			const fixture = {props:{
				scale: {
					domain: propDomainSpy
				}
			}};

			expect(getTickValues.call(fixture, {})).toBe(propDomainVal, 'domain from prop scale');
			expect(propDomainSpy.calls.length).toBe(1, 'use prop scale');

			expect(getTickValues.call(fixture, {
				scale: { domain: argDomainSpy }
			})).toBe(argDomainVal, 'domain from arg scale');
			expect(propDomainSpy.calls.length).toBe(1, 'not use prop scale');
			expect(argDomainSpy.calls.length).toBe(1, 'use arg scale');
		});

		it('should return ticks if scale supports it', () => {
			const getTicksSpy = createSpy().andReturn(10);
			const propTicksSpy = createSpy().andCall((...args) => [0].concat(args));
			const argTicksSpy = createSpy().andCall((...args) => [5].concat(args));
			const fixture = {
				props: {
					ticks: 30,
					scale: {
						ticks: propTicksSpy
					}
				}
			};

			// Test without getTicks on fixture
			expect(getTickValues.call(fixture, {})).toEqual([0, 30], 'without getTicks');
			expect(propTicksSpy.calls.length).toBe(1, 'without getTicks (prop scale.ticks call len)');
			expect(propTicksSpy.calls[0].arguments).toEqual([30], 'without getTicks (prop scale.ticks call arg)');

			// Add getTicks to fixture for remaining tests
			fixture.getTicks = getTicksSpy;

			expect(getTickValues.call(fixture, {})).toEqual([0, 10], 'with getTicks');
			expect(getTicksSpy.calls.length).toBe(1, 'with getTicks (getTicks call len)');
			expect(propTicksSpy.calls.length).toBe(2, 'with getTicks (prop scale.ticks call len)');
			expect(propTicksSpy.calls[1].arguments).toEqual([10], 'with getTicks (prop scale.ticks call arg)');

			expect(getTickValues.call(fixture, {
				scale: { ticks: argTicksSpy }
			})).toEqual([5, 10], 'with arg scale');
			expect(propTicksSpy.calls.length).toBe(2, 'with arg scale (prop scale.ticks call len)');
			expect(argTicksSpy.calls.length).toBe(1, 'with arg scale (arg scale.ticks call len)');
			expect(argTicksSpy.calls[0].arguments).toEqual([10], 'with arg scale (arg scale.ticks call args)');

			expect(getTickValues.call(fixture, {
				ticks: ['year', 10]
			})).toEqual([0, 'year', 10], 'with arg ticks');
		});
	});

	describe('getTickFormat', () => {
		it('should return format as-is if function', () => {
			const argFormat = v => v;
			const fixture = {
				props: {
					format: v => v
				}
			};

			expect(getTickFormat.call(fixture, {})).toBe(fixture.props.format);
			expect(getTickFormat.call(fixture, {format: argFormat})).toBe(argFormat);
		});

		it('should return defaultFormat if no scale.tickFormat', () => {
			const argDefaultFormat = v => v;
			const fixture = {
				props: {
					scale: {}
				}
			};
			expect(getTickFormat.call(fixture, {})).toBe(globalDefaultFormat);
			expect(getTickFormat.call(fixture, {defaultFormat: argDefaultFormat})).toBe(argDefaultFormat);
			expect(getTickFormat.call(fixture, {defaultFormat: void 0})).toBe(globalDefaultFormat);
			expect(getTickFormat.call(fixture, {defaultFormat: null})).toBe(null);
		});

		it('should return tick formatter if supported', () => {
			const getTicksSpy = createSpy().andReturn(10);
			const propFormatVal = v => v;
			const propTickFormatSpy = createSpy().andReturn(propFormatVal);
			const argFormatVal = v => v;
			const argTickFormatSpy = createSpy().andReturn(argFormatVal);
			const fixture = {
				props: {
					ticks: 20,
					scale: {
						tickFormat: propTickFormatSpy
					}
				}
			};

			expect(getTickFormat.call(fixture, {})).toBe(propFormatVal, 'tickFormat from prop wo/ getTicks');
			expect(propTickFormatSpy.calls.length).toBe(1);
			expect(propTickFormatSpy.calls[0].arguments).toEqual([20]);

			expect(getTickFormat.call(fixture, { ticks: 0 })).toBe(propFormatVal, 'ticks arg overrides prop');
			expect(propTickFormatSpy.calls.length).toBe(2);
			expect(propTickFormatSpy.calls[1].arguments).toEqual([0]);

			expect(getTickFormat.call(fixture, { ticks: 30 })).toBe(propFormatVal, 'ticks arg overrides prop (zero)');
			expect(propTickFormatSpy.calls.length).toBe(3);
			expect(propTickFormatSpy.calls[propTickFormatSpy.calls.length - 1].arguments).toEqual([30]);

			// Add getTicks to fixture for remaining tests
			fixture.getTicks = getTicksSpy;

			expect(getTickFormat.call(fixture, {})).toBe(propFormatVal, 'tickFormat from prop  w/ getTicks');
			expect(getTicksSpy.calls.length).toBe(1);
			expect(propTickFormatSpy.calls.length).toBe(4);
			expect(propTickFormatSpy.calls[propTickFormatSpy.calls.length - 1].arguments).toEqual([10]);

			expect(getTickFormat.call(fixture, {
				ticks: ['year', 20]
			})).toBe(propFormatVal, 'tickFormat from prop with array ticks');
			expect(propTickFormatSpy.calls.length).toBe(5);
			expect(propTickFormatSpy.calls[propTickFormatSpy.calls.length - 1].arguments).toEqual(['year', 20]);

			expect(getTickFormat.call(fixture, {
				scale: { tickFormat: argTickFormatSpy }
			})).toBe(argFormatVal, 'tickFormat from arg');
			expect(propTickFormatSpy.calls.length).toBe(5);
			expect(argTickFormatSpy.calls.length).toBe(1);
			expect(argTickFormatSpy.calls[argTickFormatSpy.calls.length - 1].arguments).toEqual([10]);
		});
	});

	describe('mixin export', () => {
		it('should be an object with props', () => {
			expect(typeof mixin).toBe('object');
			expect(Object.keys(mixin).sort()).toEqual([
				'getTicks',
				'getTickValues',
				'getTickFormat'
			].sort());
		});
	});
});
