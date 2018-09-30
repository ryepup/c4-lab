const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const dist = path.join(__dirname, "dist");

module.exports = {
    entry: './src/index.js',
    module: {
        noParse: /viz\.js/,
        rules: [
            {
                test: /\.(sexp|dot|md)$/,
                use: 'raw-loader'
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    allChunks: true,
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: 'babel-loader'
            },
            {
                test: /\.ts$/,
                exclude: /(node_modules)/,
                use: ['babel-loader', 'ts-loader']

            },
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: 'source-map-loader'
            },
            {
                enforce: 'pre',
                test: /\.ts$/,
                exclude: /(node_modules)/,
                use: [
                    'source-map-loader',
                    'tslint-loader'
                ]
            },
            {
                test: /\.png$/,
                use: 'url-loader'
            }]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    externals: {
        'fs': 'empty' // drop support for some node-only viz.js features
    },
    output: {
        filename: '[name].[chunkhash].js',
        path: dist
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new ExtractTextPlugin('styles/[name].[contenthash].css')
    ]
};