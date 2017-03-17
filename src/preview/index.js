import * as angular from 'angular'
import * as previewComponent from './preview.component'

export default angular.module('c4-lab.preview', [])
    .component(previewComponent.name, previewComponent.options)
    .name;