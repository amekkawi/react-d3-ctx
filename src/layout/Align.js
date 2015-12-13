"use strict";

import React from 'react';

export const Align = React.createClass({
	propTypes: {
		orient: React.PropTypes.oneOf(['top', 'bottom', 'left', 'right']).isRequired,
		width: React.PropTypes.number,
		height: React.PropTypes.number,
		className: React.PropTypes.string,
		offset: React.PropTypes.number,
	},
	getDefaultProps() {
		return {
			className: 'rd3-axisalign',
			offset: 0
		};
	},
	getTransform() {
		const {orient, offset, width, height} = this.props;
		switch (orient) {
			case 'top':
				return `translate(0,${offset})`;
			case 'bottom':
				return `translate(0,${height + offset})`;
			case 'left':
				return `translate(${offset},0)`;
			default: // 'right'
				return `translate(${width + offset},0)`;
		}
	},
	render() {
		const {className, children} = this.props;
		const transform = this.getTransform();
		return <g className={className} transform={transform}>
			{children}
		</g>
	}
});

export default React.createClass({
	contextTypes: {
		width: React.PropTypes.number,
		height: React.PropTypes.number,
	},
	childContextTypes: {
		orient: React.PropTypes.string,
	},
	getChildContext() {
		const {orient} = this.props;
		return {
			orient
		};
	},
	propTypes: {
		orient: React.PropTypes.oneOf(['top', 'bottom', 'left', 'right']).isRequired
	},
	render() {
		return <Align {...this.context} {...this.props} />
	}
});
