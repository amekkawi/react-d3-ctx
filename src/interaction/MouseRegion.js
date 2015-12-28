"use strict";

import React from 'react';
import throttleFn from 'lodash.throttle';

export default React.createClass({
	displayName: 'MouseRegion',
	propTypes: {
		width: React.PropTypes.number.isRequired,
		height: React.PropTypes.number.isRequired,
		throttle: React.PropTypes.number,
	},
	childContextTypes: {
		width: React.PropTypes.number,
		height: React.PropTypes.number,
		mouseOffsetX: React.PropTypes.number,
		mouseOffsetY: React.PropTypes.number,
	},
	getChildContext() {
		const {width, height} = this.props;
		const {mouseOffsetX, mouseOffsetY} = this.state;
		return {
			width,
			height,
			mouseOffsetX,
			mouseOffsetY,
		};
	},
	getDefaultProps() {
		return {
			className: 'rd3-mouseregion',
			throttle: 20,
		};
	},
	getInitialState() {
		return {
			mouseOffsetX: null,
			mouseOffsetY: null,
		};
	},
	handleMouseMove(evt) {
		const {mouseOffsetX: oldOffsetX, mouseOffsetY: oldOffsetY} = this.state;
		const targetBoundRect = evt.target.getBoundingClientRect();

		const mouseOffsetX = evt.clientX - targetBoundRect.left;
		const mouseOffsetY = evt.clientY - targetBoundRect.top;

		if (oldOffsetX !== mouseOffsetX || oldOffsetY !== mouseOffsetY)
			this._throttleSetOffset({
				mouseOffsetX,
				mouseOffsetY,
			});
	},
	handleMouseOut() {
		if (this._throttleSetOffset)
			this._throttleSetOffset.cancel();

		this.setState({
			mouseOffsetX: null,
			mouseOffsetY: null,
		});
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
		const {children, width, height, throttle, ...props} = this.props;
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
