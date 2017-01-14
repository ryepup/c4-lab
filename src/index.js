import vNext from './vNext'
import 'babel-polyfill'
import * as angular from 'angular'
import metaTemplate from './meta.html'
import MetaController from './meta.controller'


angular.module('c4-lab', [vNext])
  .component('c4LabMeta', {
    template: metaTemplate,
    controller: MetaController,
    controllerAs: 'vm'
  })
  .config(allowBlobsAndDataHrefs)
  ;

// @ngInject
function allowBlobsAndDataHrefs($compileProvider) {
  $compileProvider
    .aHrefSanitizationWhitelist(/^(https?|ftp|mailto|blob|data):/i);
}
