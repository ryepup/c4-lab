import * as angular from 'angular'
import configureRoutes from './routes'
import * as app from './app.component'
import * as nav from './nav.component'
import * as editor from './editor.component'
import * as viewer from './viewer.component'
import 'angular-ui-codemirror'
import 'angular-ui-bootstrap'
import 'angular-animate'

const MODULE_NAME = 'c4-lab.vNext';

angular.module(MODULE_NAME, ['ui.bootstrap', 'ui.codemirror', 'ngAnimate'])
    .component(app.name, app.options)
    .component(nav.name, nav.options)
    .component(editor.name, editor.options)
    .component(viewer.name, viewer.options)
    .config(configureRoutes)
    .run(editor.install)

export default MODULE_NAME;