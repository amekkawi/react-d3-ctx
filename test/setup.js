import { jsdom } from 'jsdom'
import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = global.window.navigator;

export const SVG = React.createClass({
	render() {
		return <svg>{this.props.children}></svg>
	}
});

export function getAttrs(el, attrs) {
	return attrs.reduce((ret, attr) => {
		ret.push(el.getAttribute(attr));
		return ret;
	}, [])
}

export function getCAttrs(component, attrs) {
	return getAttrs(ReactDOM.findDOMNode(component), attrs);
}

export function expectContext(ContextComponent, Component, childContextTypes, contextProps) {
	const OuterContext = React.createClass({
		childContextTypes,
		getChildContext() {
			return contextProps;
		},
		render() {
			return this.props.children;
		}
	});

	const tree = TestUtils.renderIntoDocument(
		<OuterContext>
			<ContextComponent/>
		</OuterContext>
	);

	const contextKeys = Object.keys(ContextComponent.contextTypes).sort();
	expect(typeof ContextComponent.contextTypes).toBe('object', 'context is object');
	expect(contextKeys).toEqual(Object.keys(contextProps).sort(), 'context keys match');

	const contextChild = TestUtils.findRenderedComponentWithType(tree, ContextComponent);
	for (let i = 0; i < contextKeys.length; i++) {
		expect(contextChild.context[contextKeys[i]]).toBe(contextProps[contextKeys[i]], `context prop "${contextKeys[i]}" received from outer`);
	}

	const circlesChild = TestUtils.findRenderedComponentWithType(tree, Component);
	for (let i = 0; i < contextKeys.length; i++) {
		expect(circlesChild.props[contextKeys[i]]).toBe(contextProps[contextKeys[i]], `context prop "${contextKeys[i]}" passed as prop`);
	}
}
