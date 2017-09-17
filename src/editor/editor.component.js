import 'codemirror/mode/commonlisp/commonlisp'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closebrackets'
import '../../node_modules/codemirror/lib/codemirror.css'
import '../../node_modules/codemirror/theme/elegant.css'
import CodeMirror from 'codemirror'

import template from './editor.html'
import { parse, SyntaxError, ParseError } from '../core'
import './editor.css'
import { sourceChanged, sourceParseError, sourceParsed } from '../store/actions'



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

        this.unsubscribe = $ngRedux.connect(this.mapStateToThis, { sourceParsed, sourceChanged, sourceParseError })(this);
    }

    $onDestroy() {
        this.unsubscribe();
    }

    $onInit() {
        this.parse(this.text);
    }

    mapStateToThis(state) {
        return { text: state.source }
    }

    parse(text) {
        this.sourceChanged({ source: text})
        this.lastError = undefined;
        this.text = text;
        try {
            // TODO: move parsing into a reducer and state
            const parsed = parse(text);
            this.syntaxIsValid = true
            this.tryOnParse(text)
            this.sourceParsed({ graph: parsed })
        } catch (e) {
            this._onParseError(e);
        }
    }

    _onParseError(error) {
        this.log.error(error)
        if (error instanceof SyntaxError || error instanceof ParseError) {
            this.syntaxIsValid = false
            this.lastError = error

            this.sourceParseError({error: error.message, line: error.line, column: error.col})
        }
    }

    // TODO: delete me, interested parties can pull from redux
    tryOnParse(text) {
        if (!this.onParse) return;
        try {
            this.onParse({ text })
        } catch (e) {
            this.log.error('Trouble firing onParse event', e);
        }
    }
}

export const name = "c4LabEditor"
export const options = {
    template: template,
    controller: EditorController,
    bindings: {
        onParse: '&'
    }
}

// @ngInject
export function install($window, $log) {
    $log.debug('installing codemirror')
    $window.CodeMirror = CodeMirror;
}