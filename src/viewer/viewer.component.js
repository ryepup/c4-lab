import template from './viewer.html'


class ViewerComponent {
    constructor($log, $sce, $state, $ngRedux) {
        'ngInject'
        this.$log = $log;
        this.$state = $state;
        this.$sce = $sce;


        this.unsubscribe = $ngRedux.connect(this.mapStateToThis.bind(this))(
            (selectedState, actions) => {
                Object.assign(this, selectedState, actions);
                if (this.graph) this._onGraphChanged();
            });
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
        const [name, params] = this._nextState();
        return this.$state.go(name, params);
    }

    _onGraphChanged() {
        this.ngModel && this.ngModel.$setViewValue(this.dot);
    }
}


export const name = 'c4LabViewer';
export const options = {
    require: {
        ngModel: '^'
    },
    transclude: true,
    template,
    controller: ViewerComponent
}