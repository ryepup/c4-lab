var _ = require('lodash');
// @ngInject
module.exports = function($uibModal, model) {
  var self = this;
  self.openActorModal = openActorModal;
  self.openSystemModal = openSystemModal;
  self.openConnectionModal = openConnectionModal;

  /**
   * @return Promise for user-entered actor
   */
  function openActorModal(item) {
    return openModal(require('./actorEditor.html'), item);
  }
  /**
   * @return Promise for user-entered system
   */
  function openSystemModal(item) {
    return openModal(require('./systemEditor.html'), item);
  }

  function openConnectionModal(graph, item) {
    var sources = model.sources(graph);

    var modal = $uibModal.open({
      template: require('./connectionEditor.html'),
      controller: function() {
        var vm = this;
        vm.item = _.clone(item || {});
        vm.item.source = model.findItem(graph, vm.item.sourceId);
        vm.item.destination = model.findItem(graph, vm.item.destinationId);
        vm.sources = sources;
        vm.destinations = model.destinations.bind(model, graph);
        vm.cancel = function() { modal.dismiss('cancel'); };
        vm.ok = function() { modal.close(vm.item); };
      },
      controllerAs: 'vm'
    });
    return modal.result;
  }


  function openModal(template, item) {
    var modal = $uibModal.open({
          template: template,
          controller: function() {
            var vm = this;
            vm.item = _.clone(item || {});
            vm.cancel = function() { modal.dismiss('cancel'); };
            vm.ok = function() { modal.close(vm.item); };
          },
          controllerAs: 'vm'
        });
    return modal.result;
  }
};
