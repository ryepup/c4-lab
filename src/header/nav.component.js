import template from './nav.html'
import './nav.css'
// TODO: don't need core, just look at redux
import { DataStore, uriEncode, formats } from '../core/index'
import { readAllText } from './importer'
import * as aboutComponent from './about.component'

class NavController {
    constructor($state, $uibModal, $window, $ngRedux) {
        'ngInject'
        this.$state = $state
        this.$uibModal = $uibModal
        this.storage = new DataStore($window.localStorage)
        this.exportFormats = formats

        this.unsubscribe = $ngRedux.connect(this.mapStateToThis)(this);
    }

    $onDestroy() {
        this.unsubscribe();
    }

    mapStateToThis(state) {
        return { text: state.source, zoom: state.zoomNodeId }
    }

    href(zoom) {
        return this.$state.href('load',
            {
                data: uriEncode(this.text),
                zoom
            });
    }

    export(format) {
        this.onExport({ format, href: this.href() })
    }

    import(files) {
        if (files) {
            readAllText(files[0])
                .then(text => this._onImport(text))
        }
    }

    openAbout() {
        this.$uibModal.open({
            component: aboutComponent.name
        })
    }

    _onImport(text) {
        // TODO: trigger redux action
        this.storage.save(text)
        this.$state.go('home', {}, { reload: true })
    }
}

export const name = "c4LabNav"
export const options = {
    template: template,
    controller: NavController,
    bindings: {
        onExport: '&'
    }

}
