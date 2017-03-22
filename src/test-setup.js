const angular = require('angular');
require('angular-mocks');
require('../src/index.js')

beforeEach(angular.mock.module('c4-lab'));
 
const testContexts = require.context('.', true, /spec\.js$/i)
testContexts.keys().map(testContexts)
