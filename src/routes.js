class StateParamMirrorController {
  constructor($stateParams, $log){
    'ngInject'
    Object.assign(this, $stateParams)
    $log.debug('StateParamMirrorController', this)
  }
}

function configureRoutes($stateProvider, $urlRouterProvider) {
  'ngInject'
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
      template: '<c4-lab-preview encoded-text="vm.data" zoom="vm.zoom" />',
      controller: StateParamMirrorController,
      controllerAs: 'vm'
    })
}

export default configureRoutes;