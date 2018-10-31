import template from './app.html'

export class AppController {
    constructor() {
        'ngInject'
        this.codeExpanded = true;
    }
}

export const name = "c4LabApp"
export const options = {
    template: template,
    controller: AppController
}