import * as angular from 'angular'
import 'babel-polyfill'
import 'angular-ui-codemirror'
import 'angular-ui-bootstrap'
import 'angular-ui-router'
import 'angular-animate'
import 'ng-file-upload'

import metaTemplate from './meta.html'
import MetaController from './meta.controller'
import * as editor from './editor'
import * as header from './header'
import configureRoutes from './routes'
import * as shell from './shell'



angular.module('c4-lab', [
  'ui.codemirror',
  'ui.bootstrap',
  'ui.router',
  'ngAnimate',
  'ngFileUpload'])
  .component('c4LabMeta', {
    template: metaTemplate,
    controller: MetaController,
    controllerAs: 'vm'
  })
  .component(editor.name, editor.options)
  .component(shell.name, shell.options)
  .component(header.name, header.options)
  .run(editor.install)
  .config(allowBlobsAndDataHrefs)
  .config(configureRoutes)

// @ngInject
function allowBlobsAndDataHrefs($compileProvider) {
  $compileProvider
    .aHrefSanitizationWhitelist(/^(https?|ftp|mailto|blob|data):/i);
}
