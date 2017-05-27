import template from './preview.html'
import { parse, uriDecode, Exporter, DataStore } from '../core'

class PreviewComponent{
    constructor($window, $state){
        this.exporter = new Exporter($window.document)
        this.storage = new DataStore($window.localStorage)
        this.$state = $state
    }

    $onChanges(){
        this.text = uriDecode(this.encodedText)
        this.graph = parse(this.text)
    }

    onExport(format) {
        this.exporter.export(format, this.graph.title, this.text, this.dot)
    }

    edit(){
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