import vNext from './vNext';

const angular = require('angular'),
      sampleC4 = require('./exporter/c4-lab.json')
;

require('angular-ui-bootstrap');
require('angular-ui-router');
require('ng-focus-if');
require('angular-hotkeys');
require('ng-file-upload');

require('./style.css');

angular.module('c4-lab', ['ui.bootstrap', 'ngFileUpload', 'ui.router',
                          require('./editors'),
                          require('./share'),
                          vNext])
  .component('c4LabShell', {
    template: require('./shell.html'),
    controller: require('./shell.controller.js'),
    controllerAs: 'vm',
    bindings: {item:'='}
  })
  .component('c4LabViewer', {
    template: require('./viewer.html'),
    controller: require('./viewer.controller.js'),
    controllerAs: 'vm',
    bindings: {rootItem: '='}
  })
  .component('c4LabIcon',{
    template: require('./icon.html'),
    controller: require('./icon.controller.js'),
    controllerAs: 'vm',
    bindings: {type: '@'}
  })
  .component('c4LabMeta',{
    template: require('./meta.html'),
    controller: require('./meta.controller.js'),
    controllerAs: 'vm'
  })
  .component('c4LabMenu', {
    template: require('./menu.html'),
    controller: require('./menu.controller.js'),
    controllerAs: 'vm'
  })
  .service('model', require('./model'))
  .service('exporter', require('./exporter'))
  .service('autoSave', require('./autoSave'))
  .config(allowBlobsAndDataHrefs)
  .config(require('./routes'))
  .run(main)
;

// @ngInject
function allowBlobsAndDataHrefs($compileProvider) {
  $compileProvider
    .aHrefSanitizationWhitelist(/^(https?|ftp|mailto|blob|data):/i);
}

// @ngInject
function main(autoSave, model, exporter) {
  model.currentGraph = autoSave.load() || exporter.fromJson(sampleC4);
  autoSave.saveEvery(5000);
}
