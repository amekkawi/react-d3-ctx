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
		loaders: [{
			test: /\.js$/,
			loaders: ['react-hot', 'babel?presets[]=es2015-loose,presets[]=react,plugins[]=transform-object-rest-spread'],
			include: [
				path.join(__dirname, './src'),
				path.join(__dirname, '../src')
			]
		}]
	}
};
