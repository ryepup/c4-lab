import template from './nav.html'
import './nav.css'
import { uriEncode } from './codegen'

class NavController {
    constructor($state) {
        "ngInject"
        this.$state = $state
    }

    href() {
        return this.$state.href('vNext.load',
            { data: uriEncode(this.text) },
            { absolute: true });
    }

    export(event, format) {
        event.preventDefault()
        this.onExport({ format })
    }

}

export const name = "c4LabVnextNav"
export const options = {
    template: template,
    controller: NavController,
    bindings: {
        text: '<',
        exportFormats: '<',
        onExport: '&'
    }

}
