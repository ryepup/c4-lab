import template from './nav.html'
import './nav.css'
// TODO: don't need core, just look at redux
import { uriEncode, formats } from '../core/index'
import { readAllText } from './importer'
import * as aboutComponent from './about.component'
import { sourceChanged, githubLoggedIn, githubLogout, exported } from '../store/actions'

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
            { sourceChanged, githubLoggedIn, githubLogout, exported })(this);
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
        this.exported({ format })
    }

    import(files) {
        if (files) {
            readAllText(files[0])
                .then(text => this._onImport(text))
        }
    }

    // TODO: make this a route
    openAbout() {
        this.$uibModal.open({
            component: aboutComponent.name
        })
    }

    _onImport(source) {
        this.sourceChanged({ source })
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
}
