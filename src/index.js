var angular = require('angular'),
    sampleC4 = require('./exporter/c4-lab.json'),
    util = require('./util'),
    component = util.component;
require('angular-ui-bootstrap');
require('angular-ui-router');
require('ng-focus-if');
require('angular-hotkeys');
require('ng-file-upload');

require('./style.css');

angular.module('c4-lab', ['ui.bootstrap', 'ngFileUpload', 'ui.router',
                          require('./editors/index.js')])
  .directive('c4LabShell', component(require('./shell.html'), require('./shell.controller.js'),
                                     {item:'='}))
  .directive('c4LabViewer', component(require('./viewer.html'), require('./viewer.controller.js'), { rootItem: '='}))
  .directive('c4LabIcon',
             component(require('./icon.html'), require('./icon.controller.js'), {type: '@'}))
  .directive('c4LabMeta', component(require('./meta.html'), require('./meta.controller.js')))
  .directive('c4LabImport', component(require('./import.html'), require('./import.controller.js')))
  .directive('c4LabMenu', component(require('./menu.html'), require('./menu.controller.js')))
  .service('model', require('./model'))
  .service('exporter', require('./exporter'))
  .service('autoSave', require('./autoSave'))
  .config(allowBlobsAndDataHrefs)
  .config(require('./routes'))
  .run(main)
;

// @ngInject
function allowBlobsAndDataHrefs($compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^(https?|ftp|mailto|blob|data):/i);
}

// @ngInject
function main(autoSave, model, exporter) {
  model.currentGraph = autoSave.load() || exporter.fromJson(sampleC4);
  autoSave.saveEvery(5000);
}
