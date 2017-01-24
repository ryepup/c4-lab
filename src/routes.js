import { Storage, uriDecode } from './core'

class StateParamMirrorController {
  constructor($stateParams, $log){
    Object.assign(this, $stateParams)
    $log.debug('StateParamMirrorController', this)
  }
}

function configureRoutes($stateProvider, $urlRouterProvider) {
  "ngInject"
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('home', {
      url: '/?zoom',
      template: '<c4-lab-app zoom="vm.zoom"/>',
      controller: StateParamMirrorController,
      controllerAs: 'vm'
    })
    .state('load', {
      url: '/load/{data}?zoom',
      onEnter: function ($window, $stateParams, $state) {
        const storage = new Storage($window.localStorage)
        const text = uriDecode($stateParams.data)
        storage.save(text)
        $state.go('home', {zoom: $stateParams.zoom})
      }
    })
}

export default configureRoutes;