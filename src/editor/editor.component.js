import 'codemirror/mode/commonlisp/commonlisp'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closebrackets'
import '../../node_modules/codemirror/lib/codemirror.css'
import '../../node_modules/codemirror/theme/elegant.css'
import CodeMirror from 'codemirror'

import template from './editor.html'
import { parse, SyntaxError, ParseError } from '../core'
import './editor.css'

export class EditorController {

    constructor($log) {
        'ngInject'
        this.log = $log
        this.editorOptions = {
            lineNumbers: true,
            mode: "commonlisp",
            theme: "elegant",
            matchBrackets: true,
            autoCloseBrackets: true
        }
    }

    $onInit() {
        this.parse(this.initialText);
    }

    parse(text) {
        this.lastError = undefined;
        this.text = text;
        try {
            const parsed = parse(text);
            this.ngModel.$setViewValue(parsed);
            this.syntaxIsValid = true
            this.tryOnParse(text)
        } catch (e) {
            this.log.error(e)
            if (e instanceof SyntaxError || e instanceof ParseError) {
                this.syntaxIsValid = false
                this.lastError = e
            }
        }
    }

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
    require: {
        ngModel: '^'
    },
    template: template,
    // TODO: use a custom validator tied to the parser
    controller: EditorController,
    bindings: {
        initialText: '<',
        onParse: '&'
    }
}

// @ngInject
export function install($window, $log) {
    $log.debug('installing codemirror')
    $window.CodeMirror = CodeMirror;
}