import template from './nav.html'
import './nav.css'
import { uriEncode } from '../core'
import { readAllText } from './importer'

class NavController {
    constructor($state) {
        "ngInject"
        this.$state = $state
    }

    href() {
        return this.$state.href('load',
            { data: uriEncode(this.text) },
            { absolute: true });
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

}

export const name = "c4LabNav"
export const options = {
    template: template,
    controller: NavController,
    bindings: {
        text: '<',
        exportFormats: '<',
        onExport: '&',
        onImport: '&'
    }

}
