// @ngInject
module.exports = function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url:'/',
      template: '<c4-lab-shell></c4-lab-shell>'
    })
    .state('edit', {
      url:'/:id',
      template: '<c4-lab-shell item="vm.item"></c4-lab-shell>',
      controller: function($stateParams, model) {
        this.item = model.findItem(model.currentGraph, $stateParams.id);
      },
      controllerAs: 'vm'
    })
    .state('add', {
      url:'/new/{type}s?{id}',
      template: '<c4-lab-shell item="vm.item"></c4-lab-shell>',
      controller: function($stateParams, model) {
        this.item = model.findItem(model.currentGraph, $stateParams.id);
        this.type = $stateParams.type;
      },
      controllerAs: 'vm'
    })
  ;
};
