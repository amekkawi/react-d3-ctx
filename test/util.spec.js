"use strict";

import expect from 'expect';
import {isDate, getInheritableProp, createScale} from '../src/util';

describe('util', () => {
	describe('isDate', () => {
		it('should return true for a date', () => {
			expect(isDate(new Date())).toBe(true);
			expect(isDate({})).toBe(false);
			expect(isDate(Date.now())).toBe(false);
		});
	});

	describe('createScale', () => {
		it('should fail if missing values argument', () => {
			expect(() => {
				createScale();
			}).toThrow();
		});

		it('should return a function', () => {
			expect(typeof createScale([])).toBe('function');
		});

		it('should have a domain that is the extent of the values', () => {
			expect(createScale([0, 5]).domain()).toEqual([0, 5]);
			expect(createScale([5, 0]).domain()).toEqual([0, 5]);
			expect(createScale([-5, 1, 200, 5, 7]).domain()).toEqual([-5, 200]);
		});

		it('should have the default range if only domain is specified', () => {
			expect(createScale([0, 5]).range()).toEqual([0, 1]);
		});

		it('should have a range if given as the second argument', () => {
			expect(createScale([0, 5], [0, 100]).range()).toEqual([0, 100]);
			expect(createScale([0, 5], [100, 0]).range()).toEqual([100, 0]);
			expect(createScale([0, 5], [-10, 10.25]).range()).toEqual([-10, 10.25]);
		});

		it('should use time scale if first value is a date', () => {
			const baseTime = 1451520000000;
			expect(isDate(createScale([new Date()]).domain()[0])).toBe(true);
			expect(createScale([
					new Date(baseTime - 100000),
					new Date(baseTime + 100000)
			])(new Date(baseTime - 100000))).toBe(0);
			expect(createScale([
				new Date(baseTime - 100000),
				new Date(baseTime + 100000)
			])(new Date(baseTime + 100000))).toBe(1);
			expect(createScale([
				new Date(baseTime - 100000),
				new Date(baseTime + 100000)
			])(new Date(baseTime))).toBe(0.5);
			expect(isDate(createScale([
				new Date(baseTime - 100000),
				new Date(baseTime + 100000)
			]).invert(0.5))).toBe(true);
			expect(createScale([
				new Date(baseTime - 100000),
				new Date(baseTime + 100000)
			]).invert(0.5).getTime()).toBe(baseTime);
		});
	});

	describe.skip('calculateScales', () => {
		it('should return object with xScale and yScale props');
		it('should use first arg as xScale range');
		it('should use second arg as inverted yScale range');
		it('should use third arg xScale domain');
		it('should use fourth arg yScale domain');
	});

	describe('getInheritableProp', () => {
		it('should fail if the first arg is not an object', () => {
			expect(() => {getInheritableProp()}).toThrow();
			expect(() => {getInheritableProp(null)}).toThrow();
		})

		it('should fail if the first arg does not have context/props properties', () => {
			expect(() => {getInheritableProp({})}).toThrow();
			expect(() => {getInheritableProp({props: {}})}).toThrow();
			expect(() => {getInheritableProp({context: {}})}).toThrow();
		});

		it('should return props then context', () => {
			expect(getInheritableProp({props: {}, context: {}}, 'age')).toBe(void 0);
			expect(getInheritableProp({props: {age: 5}, context: {}}, 'age')).toBe(5);
			expect(getInheritableProp({props: {}, context: {age: 5}}, 'age')).toBe(5);
			expect(getInheritableProp({props: {age: 5}, context: {age: 50}}, 'age')).toBe(5);
			expect(getInheritableProp({props: {age: 0}, context: {age: 50}}, 'age')).toBe(0);
			expect(getInheritableProp({props: {age: ''}, context: {age: 50}}, 'age')).toBe('');
			expect(getInheritableProp({props: {age: false}, context: {age: 50}}, 'age')).toBe(false);
			expect(getInheritableProp({props: {age: null}, context: {age: 50}}, 'age')).toBe(50);
			expect(getInheritableProp({props: {age: void 0}, context: {age: 50}}, 'age')).toBe(50);
		});
	});

	describe.skip('wrapAsPure', () => {
		it('should use specified display name');
		it('should contain wrapped component');
		it('should not render on shallow inequality');
		it('should not re-render on shallow equality');
	});

	describe.skip('wrapForContext', () => {
		it('should use specified display name');
		it('should use specified contextTypes');
		it('should pass contextType values');
		it('should override contextType values with props');
	});
});
