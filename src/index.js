var angular = require('angular');
require('angular-ui-bootstrap');
require('ng-focus-if');
require('angular-hotkeys');

require('./style.css');


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


angular.module('c4-lab', ['ui.bootstrap', 'focus-if', 'cfp.hotkeys'])
  .directive('c4LabShell', component(require('./shell.html'), require('./shell.controller.js')))
  .directive('c4LabEditor', component(require('./editor.html'), require('./editor.controller.js'), { graph: '='}))
  .directive('c4LabViewer', component(require('./viewer.html'), require('./viewer.controller.js'), { graph: '='}))
  .directive('c4LabIcon',
             component(require('./icon.html'), require('./icon.controller.js'), {type: '@'}))
  .directive('c4LabMeta', component(require('./meta.html'), require('./meta.controller.js')))
  .directive('c4LabSaveAs', component(require('./saveAs.html'), require('./saveAs.controller.js'), { graph: '='}))
  .service('editors', require('./editors'))
  .service('model', require('./model'))
  .service('exporter', require('./exporter'))
  .service('autoSave', require('./autoSave'))
  .config(allowBlobsAndDataHrefs)
;

// @ngInject
function allowBlobsAndDataHrefs($compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^(https?|ftp|mailto|blob|data):/i);
}
