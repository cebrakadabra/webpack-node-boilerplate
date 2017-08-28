const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const NotificationPlugin = require('./internal/webpack/NotificationPlugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: 'index.html',
  inject: 'body',
	chunksSortMode: function (chunk1, chunk2) {
		var orders = ['main'];
		var order1 = orders.indexOf(chunk1.names[0]);
		var order2 = orders.indexOf(chunk2.names[0]);
		if (order1 > order2) {
			return 1;
		} else if (order1 < order2) {
			return -1;
		} else {
			return 0;
		}
	}
});

module.exports = {
  entry: {
		main: './src/js/main'
	},
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name]_bundle.js'
  },
	devtool: 'inline-source-map',
	devServer: {
		contentBase: ['./build'],
		port: process.env.PORT || 3000,
		host: process.env.HOST || 'localhost',
		hot: true,
		overlay: {
		  warnings: true,
		  errors: true
		},
		setup: function(app) {
			app.get('/versions', function(req, res) {
				const getDirs = p => fs.readdirSync(p).filter(f => fs.statSync(p+"/"+f).isDirectory());
				const dirs = getDirs(path.resolve(__dirname, './src/dist/vendor/bitmovin/src'));
				res.setHeader('Content-Type', 'application/json');
    		res.send(JSON.stringify({ versions: dirs }));
			});
		},
	},
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /(node_modules|src\/dist\/vendor\/bitmovin)/ },
      { test: /\.css|.less?$/, loader: 'style-loader!css-loader!less-loader', exclude: /node_modules/ },
	    { test: /\.png?$/, loader: 'file-loader', exclude: /node_modules/ }
    ]
  },
  plugins: [
		new CleanWebpackPlugin(['build']),
		new CopyWebpackPlugin([
			{ from: 'src/vendor', to: 'vendor' },
			{ from: 'public', to: '' },
		]),
		new webpack.HotModuleReplacementPlugin(),
		new NotificationPlugin(),
		HtmlWebpackPluginConfig,
	]
};
