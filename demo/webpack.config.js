var path = require('path');
var webpack = require('webpack');

module.exports = {
	devtool: 'eval',
	entry: [
		'webpack-dev-server/client?http://localhost:3001',
		'webpack/hot/only-dev-server',
		'./src/index'
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/static/'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	],
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'react-hot',
				include: [
					path.join(__dirname, './src'),
					path.join(__dirname, '../src')
				]
			},
			{
				test: /\.js$/,
				loader: 'babel',
				query: require('../babel-config'),
				include: [
					path.join(__dirname, './src'),
					path.join(__dirname, '../src')
				]
			}
		]
	}
};
