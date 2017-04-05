import * as angular from 'angular'
import template from './help.html'
import helpMarkdown from './help.md'
import 'angular-marked'

class HelpController {
    constructor(){
        this.content = helpMarkdown
    }
}

export default angular
    .module('c4-lab.help', ['hc.marked'])
    .component('c4LabHelp', {
        template,
        controller: HelpController
    })
    .name