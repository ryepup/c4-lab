module.exports = function($uibModal, model) {
  var self = this;
  self.openActorModal = openActorModal;
  self.openSystemModal = openSystemModal;
  self.openConnectionModal = openConnectionModal;

  /**
   * @return Promise for user-entered actor
   */
  function openActorModal() {
    return openModal(require('./actorEditor.html'), {});
  }
  /**
   * @return Promise for user-entered system
   */
  function openSystemModal() {
    return openModal(require('./systemEditor.html'), {});
  }

  function openConnectionModal(graph) {
    var sources = model.sources(graph);

    var modal = $uibModal.open({
      template: require('./connectionEditor.html'),
      controller: function() {
        var vm = this;
        vm.item = {};
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
        vm.item = item;
        vm.cancel = function() { modal.dismiss('cancel'); };
        vm.ok = function() { modal.close(vm.item); };
      },
      controllerAs: 'vm'
    });
    return modal.result;
  }
};
