import template from './viewer.html'
import { toSvg, toDot } from '../core'

class ViewerComponent {
    constructor($log, $sce, $state) {
        'ngInject'
        this.$log = $log;
        this.$state = $state;

        this.toSvg = dot => $sce.trustAsHtml(toSvg(dot))
    }

    $onChanges(diffs) {
        if (diffs.graph) this._onGraphChanged();
    }

    onZoom() {
        const [name, params] = this._nextState();
        return this.$state.go(name, params);
    }

    _onGraphChanged() {
        this.$log.debug('redrawing')
        this._recalculateExpandableNodes()
        this.dot = toDot(this.graph, this.zoom, x => this._hrefTo(x))

        this.svg = this.toSvg(this.dot)
        this.ngModel.$setViewValue(this.dot);
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

    _recalculateExpandableNodes() {
        this.expandableNodes = this.graph.items
            .filter(x => x.canExpand)
            .sort(x => x.path)
    }

}


export const name = 'c4LabViewer';
export const options = {
    require: {
        ngModel: '^'
    },
    template,
    controller: ViewerComponent,
    bindings: {
        zoom: '<',
        graph: '<'
    }
}