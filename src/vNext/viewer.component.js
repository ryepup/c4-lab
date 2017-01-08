export class ViewerController {
    // @ngInject
    constructor($sce, exporter, $log) {
        this.log = $log
        this.toSVG = graph => $sce.trustAsHtml(exporter.toSVG(graph))
    }

    $init() {
        this.log.debug('starting up');
    }

    $onChanges(changesObj) {
        if(!this.graph) return;
        this.log.debug('changes', changesObj)
        this.svg = this.toSVG(this.graph)
    }

}

export const name = "c4LabVnextViewer"
export const options = {
    template: '<div ng-bind-html="$ctrl.svg"></div>',
    controller: ViewerController,
    bindings: { graph: '<' }
}