import template from './preview.html'
import { preview } from '../store/actions'
// TODO: don't need core, just look at redux
import { Exporter, DataStore } from '../core/index'

class PreviewComponent {
    constructor($window, $state, $ngRedux) {
        this.exporter = new Exporter($window.document)
        this.storage = new DataStore($window.localStorage)
        this.$state = $state

        this.unsubscribe = $ngRedux.connect(
            () => ({}),
            { preview })(this);

    }

    $onDestroy() {
        this.unsubscribe();
    }

    $onChanges(diff) {
        if (diff.encodedText) {
            this.preview({
                encodedSource: this.encodedText
            })
        }
    }

    onExport(format) {
        this.exporter.export(format, this.graph.title, this.text, this.dot)
    }

    edit() {
        this.storage.save(this.text)
        this.$state.go('home')
    }
}


export const name = 'c4LabPreview';
export const options = {
    template,
    controller: PreviewComponent,
    bindings: {
        zoom: '<',
        encodedText: '<'
    }
}