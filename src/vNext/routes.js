import { uriDecode } from './codegen'
import { Storage } from './storage'

function configureRoutes($stateProvider, $urlRouterProvider) {
  "ngInject"
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('home', {
      url: '/',
      template: '<c4-lab-vnext-app />'
    })
    .state('load', {
      url: '/load/{data}',
      onEnter: function ($window, $stateParams, $state) {
        const storage = new Storage($window.localStorage)
        const text = uriDecode($stateParams.data)
        storage.save(text)
        $state.go('home')
      }
    })
}

export default configureRoutes;