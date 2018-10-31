import template from './preview.html'
import { preview, previewEdit } from '../store/actions'

class PreviewComponent {
    constructor($ngRedux) {
        this.unsubscribe = $ngRedux.connect(
            null,
            { preview, previewEdit })(this);

    }

    $onDestroy() {
        this.unsubscribe();
    }

    $onChanges() {
        this.preview({
            encodedSource: this.encodedText
        })
    }
}


export const name = 'c4LabPreview';
export const options = {
    template,
    controller: PreviewComponent,
    bindings: {
        encodedText: '<'
    }
}