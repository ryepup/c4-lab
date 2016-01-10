module.exports = function(config) {
  config.set({
    files: [
      'src/test-setup.js',
      'src/index.js',
      'src/**/*.spec.js'],
    frameworks: ['jasmine', 'browserify'],
    browsers: ['PhantomJS'],
    preprocessors: {
      'src/**/*.js': 'browserify'
    },
    browserify: {
      debug: true,
      noParse: ['viz.js'],
      transform:[
        ['browserify-istanbul', {
          ignore: '**/node_modules/** **/*.spec.js **/*.dot **/*.html **/*.css **/test-setup.js'
            .split(' ')
        }]
      ]
    },
    reporters: config.reporters.concat(['coverage']),
    coverageReporter: {
      dir: 'reports',
      reporters: [
        { type: 'lcovonly', subdir: '.', file: 'lcov.info' },
        { type: 'text-summary' }
      ]
    }

  });
};
