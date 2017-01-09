import template from './app.html'
import sample from './c4lab.sexp'

export class AppController {

    constructor($log) {
        this.log = $log
        this.selectedRoot = null
    }

    $onInit() {
        // TODO: use autosave
        this.initialText = sample
    }

    onParse() {
        this.expandableNodes = this.graph.items
            .filter(x => x.canExpand)
            .sort(x => x.path)
    }
}

export const name = "c4LabVnextApp"
export const options = {
    template: template,
    controller: AppController
}