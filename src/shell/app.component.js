import template from './app.html'
import sample from './c4lab.sexp'

import { Storage, toSvg, Exporter, formats, toDot } from '../core'

export class AppController {

    constructor($log, $window, $state, $sce) {
        'ngInject'
        this.log = $log
        this.$window = $window
        this.$state = $state
        this.storage = new Storage($window.localStorage)
        this.exporter = new Exporter($window.document)
        this.exportFormats = formats
        this.toSvg = dot => $sce.trustAsHtml(toSvg(dot))
        this.hrefTo = zoom => $state.href('home', { zoom })
    }

    $onInit() {
        this.initialText = this.storage.load() || sample
    }

    onParse(text) {
        this.log.debug('onParse')
        this.text = text
        this.expandableNodes = this.graph.items
            .filter(x => x.canExpand)
            .sort(x => x.path)
        this.storage.save(text)
        this.recalculate()
    }

    onZoom() {
        this.$state.go('home', { zoom: this.zoom })
    }

    recalculate() {
        this.log.debug('recalculate', this.zoom, this.graph)
        this.dot = toDot(this.graph, this.zoom, this.hrefTo)
        this.svg = this.toSvg(this.dot)
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