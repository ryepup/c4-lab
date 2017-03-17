import * as angular from 'angular'
import * as previewComponent from './preview.component'
import header from '../header'
import viewer from '../viewer'

export default angular.module('c4-lab.preview', [header, viewer])
    .component(previewComponent.name, previewComponent.options)
    .name;