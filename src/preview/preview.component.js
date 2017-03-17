import template from './preview.html'
import { parse, uriDecode, Exporter } from '../core'

class PreviewComponent{
    constructor($window){
        this.exporter = new Exporter($window.document)
    }

    $onChanges(){
        this.text = uriDecode(this.encodedText)
        this.graph = parse(this.text)
    }

    onExport(format) {
        this.exporter.export(format, this.graph.title, this.text, this.dot)
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