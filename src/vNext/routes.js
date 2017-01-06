// @ngInject
function configureRoutes($stateProvider) {

  $stateProvider
    .state('vNext', {
      url: '/v-next',
      abstract: true,
      template: '<ui-view />'
    })
    .state('vNext.home', {
        url: '/',
        template: '<c4-lab-vnext-app />'
    });
}

export default configureRoutes;