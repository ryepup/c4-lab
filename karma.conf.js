module.exports = function(config) {
  config.set({
    files: [
      'src/test-setup.js',
      'src/**/*.spec.js'],
    frameworks: ['jasmine', 'browserify'],
    browsers: ['PhantomJS'],
    preprocessors: {
      'src/**/*.js': 'browserify'
    },
    browserify: {
      debug: true
    }
  });
};
