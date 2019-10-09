import path from 'path';
import webpack from 'webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

import removeNull from './internal/utils/removeNull';
import UglifyJsPluginConfig from './internal/webpack/UglifyPlugin';
import HtmlWebpackPluginConfig from './internal/webpack/HtmlWebpackPlugin';
import NotificationPlugin from './internal/webpack/NotificationPlugin';

const plugins = [
    new CleanWebpackPlugin(['build']),
    new webpack.DefinePlugin({
        NODE_ENV: process.env.NODE_ENV,
    }),
    new CopyWebpackPlugin([
        { from: 'src/vendor', to: 'vendor' },
        { from: 'public', to: '' },
    ]),
    new webpack.HotModuleReplacementPlugin(),
    new NotificationPlugin(),
];

const customPlugins = removeNull([UglifyJsPluginConfig, HtmlWebpackPluginConfig]);

const webpackPlugins = [...plugins, ...customPlugins];

module.exports = {
    entry: {
        main: './src/js/main',
    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name]_bundle.js',
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'build'),
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost',
        proxy: {
            '/api': 'http://localhost:5000',
        },
        hot: true,
        overlay: {
            warnings: true,
            errors: true,
        }
    },
    module: {
        rules: [
            { test: /\.js$/, loader: 'babel-loader', exclude: /(node_modules|src\/dist\/vendor\/bitmovin)/ },
            { test: /\.css|.less?$/, loader: 'style-loader!css-loader!less-loader', exclude: /node_modules/ },
            { test: /\.png?$/, loader: 'file-loader', exclude: /node_modules/ },
        ],
    },
    plugins: webpackPlugins,
};
