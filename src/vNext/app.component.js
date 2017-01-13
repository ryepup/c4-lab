import template from './app.html'
import sample from './c4lab.sexp'
import { Storage } from './storage'
import dotExporter from '../exporter/dot'
import { prepareForRendering } from './codegen'
import { Exporter, formats } from './exporter'

export class AppController {

    constructor($log, $window) {
        this.log = $log
        this.$window = $window
        this.selectedRoot = null
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
        this.expandableNodes = this.graph.items
            .filter(x => x.canExpand)
            .sort(x => x.path)
        this.storage.save(text)
        this.recalculate()
    }

    onZoom() {
        this.log.debug('onZoom')
        this.recalculate()
    }

    recalculate() {
        this.log.debug('recalculate', this.graph)
        this.preparedGraph = prepareForRendering(this.graph, this.selectedRoot)
        this.dot = dotExporter(
            () => null,
            this.preparedGraph,
            this.graph.idMap[this.selectedRoot])
    }

    onExport(format) {
        this.exporter.export(format, 'c4lab-graph', this.text, this.dot)
    }

}

export const name = "c4LabVnextApp"
export const options = {
    template: template,
    controller: AppController
}