if(!Function.prototype.bind){
  Function.prototype.bind = require("function-bind"); // support phantomJS
}

const angular = require('angular');
require('angular-mocks');
beforeEach(angular.mock.module('c4-lab'));


beforeEach(function() {
  jasmine.addMatchers({
    toEqualTrimmed: function() {
      return {
        compare: function(actual, expected) {
          return {
            pass: actual && actual.trim() === expected.trim()
          };
        }
      };
    }
  });
});
