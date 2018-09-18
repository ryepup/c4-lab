import { zoomChanged } from './store/actions'

function configureRoutes($stateProvider, $urlRouterProvider) {
  'ngInject'
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('home', {
      url: '/?zoom',
      component: 'c4LabApp',
      resolve: {
        zoom: $stateParams => $stateParams.zoom
      },
      onEnter: (zoom, $ngRedux) => {
        const currentZoom = $ngRedux.getState().zoomNodeId;
        if (currentZoom !== zoom) {
          $ngRedux.dispatch(zoomChanged({ zoomNodeId: zoom }))
        }
      }
    })
    .state('load', {
      url: '/load/{data}?zoom',
      component: 'c4LabPreview',
      resolve: {
        encodedText: $stateParams => $stateParams.data,
        zoom: $stateParams => $stateParams.zoom
      },
      onEnter: (zoom, $ngRedux) => {
        // TODO: dedupe with other endpoint
        const currentZoom = $ngRedux.getState().zoomNodeId;
        if (currentZoom !== zoom) {
          $ngRedux.dispatch(zoomChanged({ zoomNodeId: zoom }))
        }
      }

    })
    .state('help', {
      url: '/help',
      component: 'c4LabHelp'
    })
}

export default configureRoutes;