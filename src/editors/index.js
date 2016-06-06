const angular = require('angular'),
      moduleName = 'c4-lab.editors'
;

angular.module(moduleName, ['focus-if', 'cfp.hotkeys', 'ui.router'])
  .component('c4LabItemEditor', {
    template: require('./itemEditor.html'),
    controller: require('./itemEditor.controller.js'),
    controllerAs: 'vm',
    bindings: { item : '=' }
  })
  .component('c4LabEditor', {
    template: require('./editor.html'),
    controller: require('./editor.controller.js'),
    controllerAs: 'vm',
    bindings: { item : '=' }
  })
  .run(loadTemplates);

// @ngInject
function loadTemplates($templateCache) {
  $templateCache.put('connectionForm.html', require('./connectionForm.html'));
  $templateCache.put('actorForm.html', require('./actorForm.html'));
  $templateCache.put('systemForm.html', require('./systemForm.html'));
  $templateCache.put('containerForm.html', require('./containerForm.html'));
}

module.exports = moduleName;
