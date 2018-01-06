import template from './viewer.html'
// TODO: don't need core, just look at redux
import { toSvg, toDot } from '../core/index'

class ViewerComponent {
    constructor($log, $sce, $state, $ngRedux) {
        'ngInject'
        this.$log = $log;
        this.$state = $state;

        this.toSvg = dot => $sce.trustAsHtml(toSvg(dot))

        this.unsubscribe = $ngRedux.connect(this.mapStateToThis)(
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
            zoom: state.zoomNodeId
        }
    }

    onZoom() {
        const [name, params] = this._nextState();
        return this.$state.go(name, params);
    }

    _onGraphChanged() {
        this.$log.debug('redrawing', this.zoom)
        this.dot = toDot(this.graph, this.zoom, x => this._hrefTo(x))

        this.svg = this.toSvg(this.dot)
        this.ngModel && this.ngModel.$setViewValue(this.dot);
    }

    _nextState(zoom = this.zoom) {
        const name = this.$state.current.name;
        const params = Object.assign({}, this.$state.params, { zoom })
        return [name, params]
    }

    _hrefTo(zoom) {
        const [name, params] = this._nextState(zoom);
        return this.$state.href(name, params);
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