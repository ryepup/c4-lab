import 'codemirror/mode/commonlisp/commonlisp'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closebrackets'
import '../../node_modules/codemirror/lib/codemirror.css'
import '../../node_modules/codemirror/theme/elegant.css'
import template from './editor.html'
import CodeMirror from 'codemirror'
import { parse, SyntaxError } from './parse'

export class EditorController {

    constructor() {
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
        this.text = text;
        try {
            // TODO: parse out a more general AST, not something customized for the
            // viewer
            const parsed = parse(text);
            this.ngModel.$setViewValue(parsed);
            this.syntaxIsValid = true
        } catch (e) {
            if (e instanceof SyntaxError) {
                this.syntaxIsValid = false;
            }
        }
    }
}

export const name = "c4LabVnextEditor"
export const options = {
    require: {
        ngModel: '^'
    },
    template: template,
    // TODO: use a custom validator tied to the parser
    controller: EditorController,
    bindings: {
        initialText: '<'
    }
}

// @ngInject
export function install($window, $log) {
    $log.debug('installing codemirror')
    $window.CodeMirror = CodeMirror;
}