module.exports = function(editors, model, hotkeys) {
  var vm = this, highlightId;
  vm.addActor = addActor;
  vm.addSystem = addSystem;
  vm.addConnection = addConnection;
  vm.edges = model.edges.bind(model, vm.graph);
  vm.isHighlighted = function(id) { return id === highlightId; };
  vm.highlight = function(id) { highlightId = id; };

  setupHotkeys();

  function addActor() {
    editors.openActorModal()
      .then(model.addActor.bind(model, vm.graph));
  }
  function addSystem () {
    editors.openSystemModal()
      .then(model.addSystem.bind(model, vm.graph));
  }
  function addConnection() {
    editors.openConnectionModal(vm.graph)
      .then(model.addConnection.bind(model, vm.graph));
  }
  function setupHotkeys() {
    [{
      combo:'a',
      description: 'add a new actor',
      callback: addActor
    },
     {
       combo:'s',
       description: 'add a new system',
       callback: addSystem
     },
     {
       combo:'c',
       description: 'add a new connection',
       callback: addConnection
     }
    ].map(hotkeys.add.bind(hotkeys));
  }

};
