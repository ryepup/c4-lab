import template from './app.html'
import sample from './c4lab.sexp'

import { Storage, Exporter, formats } from '../core'

export class AppController {

    constructor($log, $window, $state) {
        'ngInject'
        this.log = $log
        this.$window = $window
        this.$state = $state
        this.storage = new Storage($window.localStorage)
        this.exporter = new Exporter($window.document)
        this.exportFormats = formats
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
        const title = this.graph.title || 'c4lab-graph'
        this.exporter.export(format, title, this.text, this.dot)
    }

    onImport(text) {
        this.storage.save(text)
        this.$state.go('home', {}, { reload: true })
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