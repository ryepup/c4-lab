import template from './nav.html'
import './nav.css'
// TODO: don't need core, just look at redux
import { uriEncode, formats } from '../core/index'
import { readAllText } from './importer'
import * as aboutComponent from './about.component'
import { sourceChanged, githubLoggedIn, githubLogout, gistExport } from '../store/actions'

/* global process */
const githubLoginPopupUrl = process.env.C4_GITHUB_LOGIN_POPUP_URL
    || 'https://c4-lab.azurewebsites.net/api/GithubLogin?code=CZiBo89DKe5LcWUHYtYqQYkTZUU1OmLsIXOFxmBfLaL3HmVXVTCbkg==';

class NavController {
    constructor($state, $uibModal, $ngRedux, $window) {
        'ngInject'
        this.$state = $state
        this.$uibModal = $uibModal
        this.exportFormats = formats
        this.$window = $window;

        this.unsubscribe = $ngRedux.connect(
            this.mapStateToThis,
            { sourceChanged, githubLoggedIn, githubLogout, gistExport: gistExport.started })(this);
    }

    $onDestroy() {
        this.unsubscribe();
    }

    mapStateToThis(state) {
        return {
            text: state.source,
            zoom: state.zoomNodeId,
            user: state.user
        }
    }

    href(zoom) {
        return this.$state.href('load',
            {
                data: uriEncode(this.text),
                zoom
            });
    }

    export(format) {
        const href = this.href();
        if (format === 'gist') {
            this.gistExport({ href })
        } else {
            // TODO: fire an action
            this.onExport({ format, href })
        }
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
        this.sourceChanged({ source: text })
    }

    login() {
        const expectedOrigin = new URL(githubLoginPopupUrl).origin;
        this.$window.open(githubLoginPopupUrl, 'Github authentication');

        this.$window.addEventListener('message', (event) => {
            if (event.origin === expectedOrigin) {
                this.githubLoggedIn({ token: event.data.payload.token })
            }
        }, { capture: false, once: true })
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
