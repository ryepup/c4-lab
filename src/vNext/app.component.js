import template from './app.html'

export class AppController{
    // @ngInject
    constructor($log){
        this.log = $log;
    }

    $init(){
        this.log.debug('starting up');
    }
}

export const name = "c4LabVnextApp"
export const options = {
    template: template,
    controller: AppController,
    controllerAs: 'vm',
    bindings: {item:'='}
}