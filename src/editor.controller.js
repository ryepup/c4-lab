module.exports = function(editors, model) {
  var vm = this, highlightId;
  vm.addActor = addActor;
  vm.addSystem = addSystem;
  vm.addConnection = addConnection;
  vm.edges = model.edges.bind(model, vm.graph);
  vm.isHighlighted = function(id) { return id === highlightId; };
  vm.highlight = function(id) { highlightId = id; };

  function addActor() {
    editors.openActorModal()
      .then(model.addActor.bind(null, vm.graph));
  }
  function addSystem () {
    editors.openSystemModal()
      .then(model.addSystem.bind(null, vm.graph));
  }
  function addConnection() {
    editors.openConnectionModal(vm.graph)
      .then(model.addConnection.bind(null, vm.graph));
  }

};
