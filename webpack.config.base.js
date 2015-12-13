"use strict";

var webpack = require('webpack');

module.exports = {
	externals: {
		react: {
			root: 'React',
			commonjs2: 'react',
			commonjs: 'react',
			amd: 'react'
		},
		d3: {
			root: 'd3',
			commonjs2: 'd3',
			commonjs: 'd3',
			amd: 'd3'
		}
	},
	module: {
		loaders: [
			{ test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
		]
	},
	output: {
		library: 'rd3ctx',
		libraryTarget: 'umd'
	},
	resolve: {
		extensions: ['', '.js']
	}
}
