"use strict";

import React from 'react';

export default React.createClass({
	displayName: 'Region',
	childContextTypes: {
		width: React.PropTypes.number,
		height: React.PropTypes.number,
	},
	getChildContext() {
		const {width, height} = this.props;
		return {
			width,
			height
		};
	},
	getDefaultProps() {
		return {
			className: 'rd3-region'
		};
	},
	render() {
		const {width, height, children, ...props} = this.props;
		return <g {...props}>{children}</g>
	}
});
