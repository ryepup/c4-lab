import template from './app.html'
import sample from './c4lab.sexp'
import { Storage } from './storage'
import dotExporter from '../exporter/dot'
import { prepareForRendering } from './codegen'

export class AppController {

    constructor($log, $window) {
        this.log = $log
        this.selectedRoot = null
        this.storage = new Storage($window.localStorage)
    }

    $onInit() {
        this.initialText = this.storage.load() || sample
    }

    onParse(text) {
        this.log.debug('onParse')
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
        this.preparedGraph = prepareForRendering(this.graph, this.selectedRoot)
        this.dot = dotExporter(
            () => null,
            this.preparedGraph,
            this.graph.idMap[this.selectedRoot])
    }
}

export const name = "c4LabVnextApp"
export const options = {
    template: template,
    controller: AppController
}