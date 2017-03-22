const path = require('path');
const webpackConfig = require('./webpack.test.config')

module.exports = function (config) {
  config.set({
    files: ['src/test-setup.js'],
    frameworks: ['jasmine'],
    browsers: ['PhantomJS'],
    preprocessors: {
      'src/test-setup.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only'
    },
    reporters: ['progress', 'coverage-istanbul'],
    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly', 'text-summary'],
      dir: path.join(__dirname, 'reports'),
      fixWebpackSourcePaths: true,
      'report-config': {
        html: {
          subdir: 'html'
        }
      },
      thresholds: {
        statements: 70,
        lines: 70,
        branches: 70,
        functions: 70
      }
    }
  });
};
