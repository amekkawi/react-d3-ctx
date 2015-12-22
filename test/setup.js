import { jsdom } from 'jsdom'
import React from 'react';
import ReactDOM from 'react-dom';

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
