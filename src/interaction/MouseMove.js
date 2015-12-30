"use strict";

import React from 'react';
import throttleFn from 'lodash.throttle';
import {getInheritableProp} from '../util';

function resetState() {
	return {
		mouseOffsetX: null,
		mouseOffsetY: null,
		mousePercentX: null,
		mousePercentY: null,
		mouseUserX: null,
		mouseUserY: null,
		mouseClientX: null,
		mouseClientY: null,
	};
}

export default React.createClass({
	displayName: 'MouseMove',
	propTypes: {
		width: React.PropTypes.number,
		height: React.PropTypes.number,
		throttle: React.PropTypes.number,
	},
	contextTypes: {
		width: React.PropTypes.number,
		height: React.PropTypes.number,
	},
	childContextTypes: {
		width: React.PropTypes.number,
		height: React.PropTypes.number,
		mouseOffsetX: React.PropTypes.number,
		mouseOffsetY: React.PropTypes.number,
		mousePercentX: React.PropTypes.number,
		mousePercentY: React.PropTypes.number,
		mouseUserX: React.PropTypes.number,
		mouseUserY: React.PropTypes.number,
		mouseClientX: React.PropTypes.number,
		mouseClientY: React.PropTypes.number,
	},
	getChildContext() {
		const width = getInheritableProp(this, 'width');
		const height = getInheritableProp(this, 'height');
		const {
			mouseOffsetX, mouseOffsetY,
			mousePercentX, mousePercentY,
			mouseUserX, mouseUserY,
			mouseClientX, mouseClientY,
			} = this.state;
		return {
			width,
			height,
			mouseOffsetX,
			mouseOffsetY,
			mousePercentX,
			mousePercentY,
			mouseUserX,
			mouseUserY,
			mouseClientX,
			mouseClientY,
		};
	},
	getDefaultProps() {
		return {
			className: 'rd3-mouseregion',
			throttle: 20,
		};
	},
	getInitialState() {
		return resetState();
	},
	handleMouseMove(evt) {
		const width = getInheritableProp(this, 'width');
		const height = getInheritableProp(this, 'height');
		const {mouseOffsetX: oldOffsetX, mouseOffsetY: oldOffsetY} = this.state;
		const targetBoundRect = evt.target.getBoundingClientRect();

		const mouseOffsetX = evt.clientX - targetBoundRect.left;
		const mouseOffsetY = evt.clientY - targetBoundRect.top;
		const mousePercentX = mouseOffsetX / targetBoundRect.width;
		const mousePercentY = mouseOffsetY / targetBoundRect.height;

		if (oldOffsetX !== mouseOffsetX || oldOffsetY !== mouseOffsetY)
			this._throttleSetOffset({
				mouseClientX: evt.clientX,
				mouseClientY: evt.clientY,
				mouseOffsetX,
				mouseOffsetY,
				mousePercentX,
				mousePercentY,
				mouseUserX: mousePercentX * width,
				mouseUserY: mousePercentY * height,
			});
	},
	handleMouseOut() {
		if (this._throttleSetOffset)
			this._throttleSetOffset.cancel();
		this.setState(resetState());
	},
	componentDidMount() {
		if (!this._throttleSetOffset)
			this._throttleSetOffset = throttleFn(newState => {
				this.setState(newState);
			}, this.props.throttle);
	},
	componentWillUnmount() {
		if (this._throttleSetOffset)
			this._throttleSetOffset.cancel();
	},
	render() {
		const width = getInheritableProp(this, 'width');
		const height = getInheritableProp(this, 'height');
		const {children, width: w, height: h, throttle, ...props} = this.props;
		return (
			<g {...props}>
				{children}
				<rect
					width={width}
					height={height}
					onMouseMove={this.handleMouseMove}
					onMouseOut={this.handleMouseOut}
					fill="transparent"/>
			</g>
		)
	}
});
