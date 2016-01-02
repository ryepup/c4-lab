var angular = require('angular');

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


angular.module('c4-lab', [])
  .directive('c4LabShell', component(require('./shell.html'), require('./shell.controller.js')))
  .directive('c4LabEditor', component(require('./editor.html'), null, { graph: '='}))
  .directive('c4LabViewer', component(require('./viewer.html'), null, { graph: '='}))
  .directive('c4LabActorEditor', component(require('./actorEditor.html')))
  .directive('c4LabSystemEditor', component(require('./systemEditor.html')))
  .directive('c4LabContainerEditor', component(require('./containerEditor.html')))
  .directive('c4LabComponentEditor', component(require('./componentEditor.html')))
;
