// TODO: don't need core, just look at redux
import { Exporter } from '../core/index'
import template from './app.html'

export class AppController {

    constructor($log, $window, $ngRedux) {
        'ngInject'
        this.log = $log
        this.exporter = new Exporter($window.document)
        this.codeExpanded = true;

        this.unsubscribe = $ngRedux.connect(this.mapStateToThis)(this);
    }

    $onDestroy() {
        this.unsubscribe();
    }

    mapStateToThis(state) {
        return { text: state.source, graph: state.graph, dot: state.dot }
    }

    onExport(format, href) {
        this.log.debug('Exporting as', format, href)
        this.exporter.export(format, this.graph.title, this.text, this.dot)
    }
}

export const name = "c4LabApp"
export const options = {
    template: template,
    controller: AppController
}