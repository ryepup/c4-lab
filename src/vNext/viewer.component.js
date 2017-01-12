import { toSvg } from './renderer'

export class ViewerController {

    constructor($sce) {
        "ngInject"
        this.toSvg = dot => $sce.trustAsHtml(toSvg(dot))
    }

    $onChanges() {
        if (!this.dot) return;
        this.svg = this.toSvg(this.dot)
    }
}

export const name = "c4LabVnextViewer"
export const options = {
    template: '<div ng-bind-html="$ctrl.svg"></div>',
    controller: ViewerController,
    bindings: {
        dot: '<'
    }
}