import template from './about.html'

class AboutComponent{

}

export const name = "c4LabAboutModal"
export const options = {
    template: template,
    controller: AboutComponent,
    bindings: {
        close: '&'
    }
}
