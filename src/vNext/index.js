import * as angular from 'angular'
import configureRoutes from './routes'
import * as app from './app.component';
import * as nav from './nav.component';


const MODULE_NAME = 'c4-lab.vNext';

angular.module(MODULE_NAME, ['ui.bootstrap'])
    .component(app.name, app.options)
    .component(nav.name, nav.options)
    .config(configureRoutes);

export default MODULE_NAME;