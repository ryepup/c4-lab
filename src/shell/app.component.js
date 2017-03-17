import { Storage, Exporter } from '../core'
import template from './app.html'
import sample from './c4lab.sexp'

export class AppController {

    constructor($log, $window, $state) {
        'ngInject'
        this.log = $log
        this.$window = $window
        this.$state = $state
        this.storage = new Storage($window.localStorage)
        this.exporter = new Exporter($window.document)
    }

    $onInit() {
        this.initialText = this.storage.load() || sample
    }

    onParse(text) {
        this.log.debug('onParse')
        this.text = text
        this.storage.save(text)
    }

    onExport(format) {
        this.exporter.export(format, this.graph.title, this.text, this.dot)
    }
}

export const name = "c4LabApp"
export const options = {
    template: template,
    controller: AppController,
    bindings: {
        zoom: '<'
    }
}