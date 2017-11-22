import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

import removeNull from './internal/utils/removeNull';
import NotificationPlugin from './internal/webpack/NotificationPlugin';

const isProd = process.env.NODE_ENV === 'production';

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


const UglifyJsPluginConfig = isProd ? new UglifyJsPlugin({
    test: /\.js($|\?)/i,
    cache: true,
    parallel: true,
    sourceMap: true
}) : null;

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
		}
	},
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /(node_modules|src\/dist\/vendor\/bitmovin)/ },
      { test: /\.css|.less?$/, loader: 'style-loader!css-loader!less-loader', exclude: /node_modules/ },
        { test: /\.png?$/, loader: 'file-loader', exclude: /node_modules/ }
    ]
  },
  plugins: removeNull([
		new CleanWebpackPlugin(['build']),
        UglifyJsPluginConfig,
        new webpack.DefinePlugin({
            NODE_ENV: process.env.NODE_ENV
        }),
		new CopyWebpackPlugin([
			{ from: 'src/vendor', to: 'vendor' },
			{ from: 'public', to: '' },
		]),
		new webpack.HotModuleReplacementPlugin(),
		new NotificationPlugin(),
		HtmlWebpackPluginConfig,

	])
};
