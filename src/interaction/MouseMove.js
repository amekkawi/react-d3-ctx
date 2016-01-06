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
		mousePageX: null,
		mousePageY: null,
	};
}

export default React.createClass({
	displayName: 'MouseMove',
	propTypes: {
		width: React.PropTypes.number,
		height: React.PropTypes.number,
		throttle: React.PropTypes.number,
		onMove: React.PropTypes.func,
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
		mousePageX: React.PropTypes.number,
		mousePageY: React.PropTypes.number,
	},
	getChildContext() {
		const width = getInheritableProp(this, 'width');
		const height = getInheritableProp(this, 'height');
		const {
			mouseOffsetX, mouseOffsetY,
			mousePercentX, mousePercentY,
			mouseUserX, mouseUserY,
			mouseClientX, mouseClientY,
			mousePageX, mousePageY,
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
			mousePageX,
			mousePageY,
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
				mousePageX: evt.pageX,
				mousePageY: evt.pageY,
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
		if (this.props.onMove)
			this.props.onMove(null);
	},
	componentDidMount() {
		if (!this._throttleSetOffset)
			this._throttleSetOffset = throttleFn(newState => {
				this.setState(newState);
				if (this.props.onMove)
					this.props.onMove(newState);
			}, this.props.throttle);
	},
	componentWillUnmount() {
		if (this._throttleSetOffset)
			this._throttleSetOffset.cancel();
	},
	render() {
		const width = getInheritableProp(this, 'width');
		const height = getInheritableProp(this, 'height');
		const {children, width: w, height: h, onMove, throttle, ...props} = this.props;
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
