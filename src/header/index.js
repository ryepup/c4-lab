import angular from 'angular'
import * as nav from "./nav.component"
import * as about from "./about.component"

export default angular.module('c4-lab.header', [
    'ui.bootstrap',
    'ui.router'])
    .component(nav.name, nav.options)
    .component(about.name, about.options)
    .name