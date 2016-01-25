// @ngInject
module.exports = function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url:'/',
      template: '<div c4-lab-shell></div>'
    })
    .state('edit', {
      url:'/:id',
      template: '<div c4-lab-shell item="vm.item"></div>',
      controller: function($stateParams, model) {
        this.item = model.findItem(model.currentGraph, $stateParams.id);
      },
      controllerAs: 'vm'
    })
    .state('add', {
      url:'/new/{type}s?{id}',
      template: '<div c4-lab-shell item="vm.item"></div>',
      controller: function($stateParams, model) {
        this.item = model.findItem(model.currentGraph, $stateParams.id);
        this.type = $stateParams.type;
      },
      controllerAs: 'vm'

    })
  ;
};
