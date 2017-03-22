const merge = require('webpack-merge')
const webpackCommon = require('./webpack.common.config')

module.exports = merge(webpackCommon, {
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.spec\.js$/i,
                use: ['babel-loader?cacheDirectory=true']
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: [
                    'istanbul-instrumenter-loader',
                    'babel-loader?cacheDirectory=true'
                ]
            }
        ]
    }
})