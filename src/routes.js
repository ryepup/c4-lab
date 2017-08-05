function configureRoutes($stateProvider, $urlRouterProvider) {
  'ngInject'
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('home', {
      url: '/?zoom',
      component: 'c4LabApp',
      resolve: {
        zoom: $stateParams => $stateParams.zoom
      }
    })
    .state('load', {
      url: '/load/{data}?zoom',
      component: 'c4LabPreview',
      resolve: {
        encodedText: $stateParams => $stateParams.data,
        zoom: $stateParams => $stateParams.zoom
      }
    })
    .state('help', {
      url: '/help',
      component: 'c4LabHelp'
    })
}

export default configureRoutes;