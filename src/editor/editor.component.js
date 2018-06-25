import 'codemirror/mode/commonlisp/commonlisp'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closebrackets'
import '../../node_modules/codemirror/lib/codemirror.css'
import '../../node_modules/codemirror/theme/elegant.css'
import CodeMirror from 'codemirror'
import template from './editor.html'
import './editor.css'
import { sourceChanged } from '../store/actions'



export class EditorController {

    constructor($log, $ngRedux) {
        'ngInject'
        this.log = $log
        this.editorOptions = {
            lineNumbers: true,
            mode: "commonlisp",
            theme: "elegant",
            matchBrackets: true,
            autoCloseBrackets: true
        }

        this.unsubscribe = $ngRedux
            .connect(this.mapStateToThis, { sourceChanged })(this);
    }

    $onDestroy() {
        this.unsubscribe();
    }

    $onInit() {
        this.parse(this.text);
    }

    mapStateToThis(state) {
        return {
            text: state.source,
            parseError: state.parseError,
            syntaxIsValid: state.parseError ? false : true
        }
    }

    parse(text) {
        this.sourceChanged({ source: text })
    }
}

export const name = "c4LabEditor"
export const options = {
    template: template,
    controller: EditorController
}

// @ngInject
export function install($window, $log) {
    $log.debug('installing codemirror')
    $window.CodeMirror = CodeMirror;
}