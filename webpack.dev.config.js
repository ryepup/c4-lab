const merge = require('webpack-merge')
const webpackCommon = require('./webpack.build.config')

module.exports = merge(webpackCommon, {
    devtool: 'eval-source-map',
    devServer: {
        compress: true,
        port: 3000
    },
})