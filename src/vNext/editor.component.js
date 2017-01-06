import 'codemirror/mode/commonlisp/commonlisp'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closebrackets'
import '../../node_modules/codemirror/lib/codemirror.css'
import '../../node_modules/codemirror/theme/elegant.css'
import template from './editor.html'
import sample from './c4lab.sexp'
import CodeMirror from 'codemirror'

export class EditorController{
    constructor(){
        this.editorOptions = {
            lineNumbers: true,
            mode: "commonlisp",
            theme: "elegant",
            matchBrackets: true,
            autoCloseBrackets: true
        }
        this.text = sample
    }
}

export const name = "c4LabVnextEditor"
export const options = {
    template: template,
    controller: EditorController
}

// @ngInject
export function install($window, $log){
    $log.debug('installing codemirror')
    $window.CodeMirror = CodeMirror;
}