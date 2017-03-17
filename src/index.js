import * as angular from 'angular'
import 'babel-polyfill'
import 'angular-ui-codemirror'
import 'angular-ui-bootstrap'
import 'angular-ui-router'
import 'angular-animate'
import 'ng-file-upload'

import * as editor from './editor'
import headerModule from './header'
import * as shell from './shell'
import * as buildInfo from './build-info'
import configureRoutes from './routes'
import preview from './preview'
import viewer from './viewer'

angular.module('c4-lab', [
  'ui.codemirror',
  'ui.bootstrap',
  'ui.router',
  'ngAnimate',
  'ngFileUpload',
  headerModule,
  preview,
  viewer])
  .component(buildInfo.name, buildInfo.options)
  .component(editor.name, editor.options)
  .component(shell.name, shell.options)
  .run(editor.install)
  .config(allowBlobsAndDataHrefs)
  .config(configureRoutes)

// @ngInject
function allowBlobsAndDataHrefs($compileProvider) {
  $compileProvider
    .aHrefSanitizationWhitelist(/^(https?|ftp|mailto|blob|data):/i);
}
