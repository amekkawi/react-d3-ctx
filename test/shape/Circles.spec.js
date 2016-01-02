"use strict";

import React from 'react';
import expect from 'expect';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import {default as CirclesCtx, Circles} from '../../src/shape/Circles';
import {getAttrs, getCAttrs} from '../setup';

describe('Shape', () => {
	describe('Circles', () => {
		it('should have g with default props', () => {
			const tree = TestUtils.renderIntoDocument(
				<Circles
					data={[]}
					xScale={v => v}
					yScale={v => v} />
			);

			const circlesEl = ReactDOM.findDOMNode(tree);
			expect(circlesEl.tagName).toBe('G');
			expect(getAttrs(circlesEl, ['class', 'fill', 'stroke']))
				.toEqual(['rd3-circles', 'rgba(31, 119, 180, .75)', 'none']);
		});

		it('should override g attributes from props', () => {
			const tree = TestUtils.renderIntoDocument(
				<Circles
					className="testcls"
					fill="#F00"
					stroke="#0F0"
					strokeWidth={3}
					data={[]}
					xScale={v => v}
					yScale={v => v} />
			);

			expect(getCAttrs(tree, ['class', 'fill', 'stroke', 'stroke-width']))
				.toEqual(['testcls', '#F00', '#0F0', '3']);
		});

		it('should create circle elements', () => {
			const circlesData = [
				{
					values: [
						{ x: 0, y: 0 },
						{ x: 10, y: 10 }
					]
				},
				{
					values: [
						{ x: 20, y: 30 },
						{ x: 40, y: 50 }
					]
				}
			];

			const tree = TestUtils.renderIntoDocument(
				<Circles
					data={circlesData}
					xScale={v => v}
					yScale={v => v} />
			);

			const renderedCircles = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'circle');
			expect(renderedCircles.length).toBe(4);

			if (renderedCircles.length === 4) {
				let attrs = ['class', 'r', 'cx', 'cy'];
				expect(getCAttrs(renderedCircles[0], attrs)).toEqual([null, '3', '0', '0']);
				expect(getCAttrs(renderedCircles[1], attrs)).toEqual([null, '3', '10', '10']);
				expect(getCAttrs(renderedCircles[2], attrs)).toEqual([null, '3', '20', '30']);
				expect(getCAttrs(renderedCircles[3], attrs)).toEqual([null, '3', '40', '50']);
			}
		});

		it('should add circle class names', () => {
			const circlesData = [
				{
					values: [
						{ x: 1, y: 2 },
						{ x: 3, y: 4 }
					]
				}
			];

			const tree = TestUtils.renderIntoDocument(
				<Circles
					data={circlesData}
					circleClassName="testcls"
					xScale={v => v}
					yScale={v => v} />
			);

			const renderedCircles = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'circle');
			expect(renderedCircles.length).toBe(2);
			expect(getCAttrs(renderedCircles[0], ['class'])).toEqual(['testcls']);
			expect(getCAttrs(renderedCircles[1], ['class'])).toEqual(['testcls']);
		});

		it('should use seriesValuesAccessor', () => {
			const seriesValuesAccessor = expect.createSpy().andCall(s => s.vals);
			const circlesData = [
				{
					vals: [
						{ x: 1, y: 2 },
						{ x: 3, y: 4 }
					]
				},
				{
					vals: [
						{ x: 5, y: 6 },
						{ x: 7, y: 8 }
					]
				}
			];

			const tree = TestUtils.renderIntoDocument(
				<Circles
					data={circlesData}
					seriesValuesAccessor={seriesValuesAccessor}
					xScale={v => v}
					yScale={v => v} />
			);

			expect(seriesValuesAccessor.calls.length).toBe(2);
			expect(seriesValuesAccessor.calls[0].arguments).toEqual([circlesData[0]]);
			expect(seriesValuesAccessor.calls[1].arguments).toEqual([circlesData[1]]);

			const renderedCircles = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'circle');
			expect(renderedCircles.length).toBe(4);
			expect(getCAttrs(renderedCircles[0], ['cx', 'cy'])).toEqual(['1', '2']);
			expect(getCAttrs(renderedCircles[1], ['cx', 'cy'])).toEqual(['3', '4']);
			expect(getCAttrs(renderedCircles[2], ['cx', 'cy'])).toEqual(['5', '6']);
			expect(getCAttrs(renderedCircles[3], ['cx', 'cy'])).toEqual(['7', '8']);
		});

		it('should use xAccessor/yAccessor', () => {
			const xAccessor = expect.createSpy().andCall(s => s.xx);
			const yAccessor = expect.createSpy().andCall(s => s.yy);
			const circlesData = [
				{
					values: [
						{ xx: 1, yy: 2 },
						{ xx: 3, yy: 4 }
					]
				}
			];

			const tree = TestUtils.renderIntoDocument(
				<Circles
					data={circlesData}
					xAccessor={xAccessor}
					yAccessor={yAccessor}
					xScale={v => v}
					yScale={v => v} />
			);

			expect(xAccessor.calls.length).toBe(2);
			expect(yAccessor.calls.length).toBe(2);
			expect(xAccessor.calls[0].arguments).toEqual([circlesData[0].values[0]]);
			expect(yAccessor.calls[0].arguments).toEqual([circlesData[0].values[0]]);
			expect(xAccessor.calls[1].arguments).toEqual([circlesData[0].values[1]]);
			expect(yAccessor.calls[1].arguments).toEqual([circlesData[0].values[1]]);

			const renderedCircles = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'circle');
			expect(renderedCircles.length).toBe(2);
			expect(getCAttrs(renderedCircles[0], ['cx', 'cy'])).toEqual(['1', '2']);
			expect(getCAttrs(renderedCircles[1], ['cx', 'cy'])).toEqual(['3', '4']);
		});

		it('should use xScale/yScale', () => {
			const xScale = expect.createSpy().andCall(v => v * 2);
			const yScale = expect.createSpy().andCall(v => v * 3);

			const circlesData = [
				{
					values: [
						{ x: 5, y: 6 },
						{ x: 7, y: 8 }
					]
				}
			];

			const tree = TestUtils.renderIntoDocument(
				<Circles
					data={circlesData}
					xScale={xScale}
					yScale={yScale} />
			);

			expect(xScale.calls.length).toBe(2);
			expect(yScale.calls.length).toBe(2);
			expect(xScale.calls[0].arguments).toEqual([5]);
			expect(yScale.calls[0].arguments).toEqual([6]);
			expect(xScale.calls[1].arguments).toEqual([7]);
			expect(yScale.calls[1].arguments).toEqual([8]);

			const renderedCircles = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'circle');
			expect(renderedCircles.length).toBe(2);
			expect(getCAttrs(renderedCircles[0], ['cx', 'cy'])).toEqual(['10', '18']);
			expect(getCAttrs(renderedCircles[1], ['cx', 'cy'])).toEqual(['14', '24']);
		});

		it('should call props if functions', () => {
			const circleClassName = expect.createSpy().andCall((series, idx, idv) => 'test' + String(idx) + String(idv));
			const stroke = expect.createSpy().andCall((series, idx, idv) => '#0' + String(idx) + String(idv));
			const strokeWidth = expect.createSpy().andCall((series, idx, idv) => (idx + 1) + ((idv + 1) * 10));
			const fill = expect.createSpy().andCall((series, idx, idv) => '#F' + String(idx) + String(idv));
			const circleRadius = expect.createSpy().andCall((series, idx, idv) => (idx + 1) + ((idv + 1) * 10));

			const circlesData = [
				{
					values: [
						{ x: 1, y: 2 }
					]
				},
				{
					values: [
						{ x: 3, y: 4 },
						{ x: 5, y: 6 }
					]
				}
			];

			const tree = TestUtils.renderIntoDocument(
				<Circles
					data={circlesData}
					stroke={stroke}
					strokeWidth={strokeWidth}
					fill={fill}
					circleClassName={circleClassName}
					circleRadius={circleRadius}
					xScale={v => v}
					yScale={v => v} />
			);

			function checkSpy(spy) {
				expect(spy.calls.length).toBe(3);
				expect(spy.calls[0].arguments).toEqual([circlesData[0], 0, 0]);
				expect(spy.calls[1].arguments).toEqual([circlesData[1], 1, 0]);
				expect(spy.calls[2].arguments).toEqual([circlesData[1], 1, 1]);
			}

			checkSpy(circleClassName);
			checkSpy(stroke);
			checkSpy(strokeWidth);
			checkSpy(fill);
			checkSpy(circleRadius);

			expect(getCAttrs(tree, ['stroke', 'stroke-width', 'fill']))
				.toEqual([null, null, null]);

			const renderedCircles = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'circle');
			expect(renderedCircles.length).toBe(3);

			const elAttrs = ['class', 'stroke', 'stroke-width', 'fill', 'r'];
			expect(getCAttrs(renderedCircles[0], elAttrs)).toEqual(['test00', '#000', '11', '#F00', '11']);
			expect(getCAttrs(renderedCircles[1], elAttrs)).toEqual(['test10', '#010', '12', '#F10', '12']);
			expect(getCAttrs(renderedCircles[2], elAttrs)).toEqual(['test11', '#011', '22', '#F11', '22']);
		});

		it('should pass context', () => {
			const outerContext = {
				data: [
					{
						vals: [
							{ xx: 5, yy: 10 }
						]
					}
				],
				seriesValuesAccessor: s => s.vals,
				xScale: v => v * 10,
				yScale: v => v * 20,
				xAccessor: v => v.xx,
				yAccessor: v => v.yy,
			};

			const OuterContext = React.createClass({
				childContextTypes: {
					data: React.PropTypes.array,
					seriesValuesAccessor: React.PropTypes.func,
					xScale: React.PropTypes.func,
					yScale: React.PropTypes.func,
					xAccessor: React.PropTypes.func,
					yAccessor: React.PropTypes.func,
				},
				getChildContext() {
					return outerContext;
				},
				render() {
					return this.props.children;
				}
			});

			const tree = TestUtils.renderIntoDocument(
				<OuterContext>
					<CirclesCtx/>
				</OuterContext>
			);

			const contextChild = TestUtils.findRenderedComponentWithType(tree, CirclesCtx);
			expect(contextChild.context.data).toBe(outerContext.data);
			expect(contextChild.context.seriesValuesAccessor).toBe(outerContext.seriesValuesAccessor);
			expect(contextChild.context.xScale).toBe(outerContext.xScale);
			expect(contextChild.context.yScale).toBe(outerContext.yScale);
			expect(contextChild.context.xAccessor).toBe(outerContext.xAccessor);
			expect(contextChild.context.yAccessor).toBe(outerContext.yAccessor);

			const circlesChild = TestUtils.findRenderedComponentWithType(tree, Circles);
			expect(circlesChild.props.data).toBe(outerContext.data);
			expect(circlesChild.props.seriesValuesAccessor).toBe(outerContext.seriesValuesAccessor);
			expect(circlesChild.props.xScale).toBe(outerContext.xScale);
			expect(circlesChild.props.yScale).toBe(outerContext.yScale);
			expect(circlesChild.props.xAccessor).toBe(outerContext.xAccessor);
			expect(circlesChild.props.yAccessor).toBe(outerContext.yAccessor);
		});

		it('should override context with props', () => {
			const outerContext = {
				data: [
					{
						vals: [
							{ xx: 5, yy: 10 }
						]
					}
				],
				seriesValuesAccessor: s => s.vals,
				xScale: v => v * 10,
				yScale: v => v * 20,
				xAccessor: v => v.xx,
				yAccessor: v => v.yy,
			};

			const propOverrides = {
				data: [
					{
						vals: [
							{ xx: 5, yy: 10 }
						]
					}
				],
				seriesValuesAccessor: s => s.vals,
				xScale: v => v * 10,
				yScale: v => v * 20,
				xAccessor: v => v.xx,
				yAccessor: v => v.yy,
			};

			const OuterContext = React.createClass({
				childContextTypes: {
					data: React.PropTypes.array,
					seriesValuesAccessor: React.PropTypes.func,
					xScale: React.PropTypes.func,
					yScale: React.PropTypes.func,
					xAccessor: React.PropTypes.func,
					yAccessor: React.PropTypes.func,
				},
				getChildContext() {
					return outerContext;
				},
				render() {
					return this.props.children;
				}
			});

			const tree = TestUtils.renderIntoDocument(
				<OuterContext>
					<CirclesCtx
						{...propOverrides}
					/>
				</OuterContext>
			);

			const contextChild = TestUtils.findRenderedComponentWithType(tree, CirclesCtx);
			expect(contextChild.context.data).toBe(outerContext.data);
			expect(contextChild.context.seriesValuesAccessor).toBe(outerContext.seriesValuesAccessor);
			expect(contextChild.context.xScale).toBe(outerContext.xScale);
			expect(contextChild.context.yScale).toBe(outerContext.yScale);
			expect(contextChild.context.xAccessor).toBe(outerContext.xAccessor);
			expect(contextChild.context.yAccessor).toBe(outerContext.yAccessor);

			const circlesChild = TestUtils.findRenderedComponentWithType(tree, Circles);
			expect(circlesChild.props.data).toBe(propOverrides.data);
			expect(circlesChild.props.seriesValuesAccessor).toBe(propOverrides.seriesValuesAccessor);
			expect(circlesChild.props.xScale).toBe(propOverrides.xScale);
			expect(circlesChild.props.yScale).toBe(propOverrides.yScale);
			expect(circlesChild.props.xAccessor).toBe(propOverrides.xAccessor);
			expect(circlesChild.props.yAccessor).toBe(propOverrides.yAccessor);
		});
	});
});
