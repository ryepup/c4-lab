import template from './nav.html'
import './nav.css'
import { DataStore, uriEncode, formats } from '../core'
import { readAllText } from './importer'
import * as aboutComponent from './about.component'

class NavController {
    constructor($state, $uibModal, $window) {
        'ngInject'
        this.$state = $state
        this.$uibModal = $uibModal
        this.storage = new DataStore($window.localStorage)
        this.exportFormats = formats
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
                .then(text => this._onImport(text))
        }
    }

    openAbout(){
        this.$uibModal.open({
            component: aboutComponent.name
        })
    }

    _onImport(text) {
        this.storage.save(text)
        this.$state.go('home', {}, { reload: true })
    }
}

export const name = "c4LabNav"
export const options = {
    template: template,
    controller: NavController,
    bindings: {
        text: '<',
        onExport: '&',
        zoom: '<'
    }

}
