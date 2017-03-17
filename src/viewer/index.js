import * as angular from 'angular'
import 'angular-ui-bootstrap'
import 'angular-ui-router'

import * as viewer from './viewer.component'

export default angular.module('c4-lab.viewer', ['ui.bootstrap',
  'ui.router'])
    .component(viewer.name, viewer.options)
    .name;