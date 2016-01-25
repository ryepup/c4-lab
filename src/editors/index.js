var angular = require('angular'),
    moduleName = 'c4-lab.editors'
;

angular.module(moduleName, ['focus-if', 'ui.router'])
  .directive('c4LabItemEditor', component(require('./itemEditor.html'),
                                          require('./itemEditor.controller.js'),
                                         { item: '='}))
  .run(loadTemplates);

// @ngInject
function loadTemplates($templateCache) {
  $templateCache.put('connectionForm.html', require('./connectionForm.html'));
  $templateCache.put('actorForm.html', require('./actorForm.html'));
  $templateCache.put('systemForm.html', require('./systemForm.html'));
  $templateCache.put('containerForm.html', require('./containerForm.html'));
}

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


module.exports = moduleName;
