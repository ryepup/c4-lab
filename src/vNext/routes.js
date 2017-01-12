import { uriDecode } from './codegen'
import { Storage } from './storage'

function configureRoutes($stateProvider) {
  "ngInject"
  $stateProvider
    .state('vNext', {
      url: '/v-next',
      abstract: true,
      template: '<ui-view />'
    })
    .state('vNext.home', {
      url: '/',
      template: '<c4-lab-vnext-app />'
    })
    .state('vNext.load', {
      url: '/load/{data}',
      onEnter: function ($window, $stateParams, $state) {
        const storage = new Storage($window.localStorage)
        const text = uriDecode($stateParams.data)
        storage.save(text)
        $state.go('vNext.home')
      }
    })
}

export default configureRoutes;