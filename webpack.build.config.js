const merge = require('webpack-merge')
const webpack = require('webpack')
const webpackCommon = require('./webpack.common.config')

module.exports = merge(webpackCommon, {
    devtool: "source-map",
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module) {
                // this assumes your vendor imports exist in the 
                // node_modules directory
                return module.context
                    && module.context.indexOf('node_modules') !== -1;
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'
        }),
        new webpack.EnvironmentPlugin({
            'npm_package_version': null,
            'TRAVIS_BUILD_NUMBER': null,
            'TRAVIS_COMMIT': null,
            'npm_package_gitHead': null
        }),
        new webpack.optimize.UglifyJsPlugin({
            mangle: false,
            sourceMap: true
        })
    ]
})