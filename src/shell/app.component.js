// TODO: don't need core, just look at redux
import { DataStore, Exporter } from '../core/index'
import { GistExporter } from '../core/exporter/gist'
import template from './app.html'
import { sourceLoaded } from '../store/actions'

export class AppController {

    constructor($log, $window, $ngRedux) {
        'ngInject'
        this.log = $log
        this.$window = $window
        this.storage = new DataStore($window.localStorage)
        this.exporter = new Exporter($window.document)
        this.codeExpanded = true;

        this.unsubscribe = $ngRedux.connect(this.mapStateToThis, { sourceLoaded })(this);
    }

    $onDestroy() {
        this.unsubscribe();
    }

    mapStateToThis(state) {
        return { text: state.source, graph: state.graph }
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
        // TODO: move storage concerns elsewhere so we can do that once on app initialize
        this.sourceLoaded({ source: this.storage.load(), zoomNodeId: this.zoom })
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
        // TODO: hook up routing with redux so we can fetch this from state
        zoom: '<'
    }
}