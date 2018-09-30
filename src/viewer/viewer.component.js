import template from './viewer.html'
import { zoomChanged } from '../store/actions'


class ViewerComponent {
    constructor($log, $sce, $ngRedux) {
        'ngInject'
        this.$log = $log;
        this.$sce = $sce;

        this.unsubscribe = $ngRedux.connect(this.mapStateToThis.bind(this), { zoomChanged })(this);
    }

    $onDestroy() {
        this.unsubscribe();
    }

    mapStateToThis(state) {
        return {
            expandableNodes: state.zoomableNodes,
            graph: state.graph,
            zoom: state.zoomNodeId,
            dot: state.dot,
            svg: this.$sce.trustAsHtml(state.svg)
        }
    }

    onZoom() {
        this.zoomChanged({ zoomNodeId: this.zoom });
    }
}

export const name = 'c4LabViewer';
export const options = {
    transclude: true,
    template,
    controller: ViewerComponent
}