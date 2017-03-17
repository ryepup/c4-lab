import template from './preview.html'
import { parse, uriDecode } from '../core'

class PreviewComponent{
    constructor(){}

    $onChanges(){
        this.graph = parse(uriDecode(this.encodedText))
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