var angular = require('angular');
require('angular-ui-bootstrap');
require('ng-focus-if')

function component(template, controller, bindings) {
  return function() {
    return {
      restrict: 'EA',
      template: template,
      controller: controller || function(){},
      controllerAs: 'vm',
      bindToController: true,
      scope: bindings || {}
    };
  };
}


angular.module('c4-lab', ['ui.bootstrap', 'focus-if'])
  .directive('c4LabShell', component(require('./shell.html'), require('./shell.controller.js')))
  .directive('c4LabEditor', component(require('./editor.html'), require('./editor.controller.js'), { graph: '='}))
  .directive('c4LabViewer', component(require('./viewer.html'), require('./viewer.controller.js'), { graph: '='}))
  .service('editors', require('./editors'))
  .service('model', require('./model'))
  .service('exporter', require('./exporter'))
  .service('renderer', require('./renderer'))
;
