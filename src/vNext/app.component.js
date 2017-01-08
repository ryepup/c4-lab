import template from './app.html'
import sample from './c4lab.sexp'

export class AppController{


    $onInit(){
        // TODO: use autosave
        this.initialText = sample
    }
}

export const name = "c4LabVnextApp"
export const options = {
    template: template,
    controller: AppController
}