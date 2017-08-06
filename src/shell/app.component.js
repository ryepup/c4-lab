import { DataStore, Exporter } from '../core'
import { GistExporter } from '../core/exporter/gist'
import template from './app.html'
import sample from './c4lab.sexp'

export class AppController {

    constructor($log, $window) {
        'ngInject'
        this.log = $log
        this.$window = $window
        this.storage = new DataStore($window.localStorage)
        this.exporter = new Exporter($window.document)
        this.codeExpanded = true;
    }

    /**
     * calculate the base uri
     *
     * `$location.path()` gives the wrong value
     */
    get baseUri() {
        const l = this.$window.document.location;
        return `${l.origin}${l.pathname}`
    }

    $onInit() {
        this.initialText = this.storage.load() || sample
    }

    onParse(text) {
        this.log.debug('onParse')
        this.text = text
        this.storage.save(text)
    }

    onExport(format, href) {
        this.log.debug('Exporting as', format, href)
        if (format === 'gist') {
            const gist = new GistExporter()
            // TODO: show a loading spinner or something while we wait
            gist.export(this.graph.title, this.text, this.baseUri + href)
                .then((result) => {
                    // TODO: show a modal with the link
                    this.$window.open(result.url, '_blank')
                })
        } else {
            this.exporter.export(format, this.graph.title, this.text, this.dot)
        }

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