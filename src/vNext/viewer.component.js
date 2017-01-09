export class ViewerController {

    // @ngInject
    constructor($sce, exporter, $log) {
        this.log = $log
        this.toSVG = (graph, root) => $sce.trustAsHtml(exporter.toSVG(graph, root))
    }

    $init() {
        this.log.debug('starting up');
    }

    $onChanges(changesObj) {
        if (!this.graph) return;
        this.log.debug('changes', changesObj)
        // TODO: convert to a format favored by the exporter
        this.svg = this.toSVG(this.graph, this.rootNode && this.graph.idMap[this.rootNode])
    }

}

export const name = "c4LabVnextViewer"
export const options = {
    template: '<div ng-bind-html="$ctrl.svg"></div>',
    controller: ViewerController,
    bindings: {
        graph: '<',
        rootNode: '<'
    }
}