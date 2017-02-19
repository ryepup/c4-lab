import template from './nav.html'
import './nav.css'
import { uriEncode } from '../core'
import { readAllText } from './importer'
import * as aboutComponent from './about.component'

class NavController {
    constructor($state, $uibModal) {
        'ngInject'
        this.$state = $state
        this.$uibModal = $uibModal
    }

    href() {
        return this.$state.href('load',
            {
                data: uriEncode(this.text),
                zoom: this.zoom
            });
    }

    export(format) {
        this.onExport({ format })
    }

    import(files) {
        if (files) {
            readAllText(files[0])
                .then(text => this.onImport({ text }))
        }
    }

    openAbout(){
        this.$uibModal.open({
            component: aboutComponent.name
        })
    }

}

export const name = "c4LabNav"
export const options = {
    template: template,
    controller: NavController,
    bindings: {
        text: '<',
        exportFormats: '<',
        onExport: '&',
        onImport: '&',
        zoom: '<'
    }

}
