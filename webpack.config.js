const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const isProd = false;

module.exports = {
    mode: 'development',
    entry: './src/app.js',
    output: {
        filename: '[name].bundle.js',
        sourceMapFilename: '[file].map',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              use: ['babel-loader']
            },
            {
              test: /\.(png|jpg)$/,
              loader: "file-loader?name=assets/images/[name].[ext]",
            },
            {
              test: /\.styl$/,
              use: ['style-loader', 'css-loader', 'stylus-loader'],
            },
            {
              test: /\.css$/,
              // exclude: /node_modules/,
              // include: '/node_modules/leaflet/dist/leaflet.css', // /node_modules\/leaflet/,
              use: ['style-loader', 'css-loader'],
            },
        ]
    },
    devServer: {
        contentBase: './dist',
        overlay: true,
        hot: true
    },
    plugins: [
        new CopyWebpackPlugin({
          // patterns: ['index.html'],
          patterns: [
            {
              from: path.resolve(__dirname, 'node_modules', 'leaflet', 'dist'),
              to: "./assets/[path][name].[contenthash].[ext]"
              // to: path.resolve(__dirname, 'dist'),
            }
          ]
        }),
        new HtmlWebpackPlugin({
          template: 'index.html'
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    devtool: isProd ? undefined : 'source-map'
};