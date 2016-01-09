var _ = require('lodash');

// @ngInject
module.exports = function(editors, model, hotkeys) {
  var vm = this,
      highlightId,
      map = {
        actor: editActor,
        system: editSystem,
        container: editContainer
      }
  ;

  vm.editActor = editActor;
  vm.editSystem = editSystem;
  vm.editContainer = editContainer;
  vm.editConnection = editConnection;
  vm.edges = model.edges.bind(model, vm.graph);
  vm.children = model.children.bind(model, vm.graph);
  vm.isHighlighted = function(id) { return id === highlightId; };
  vm.highlight = function(id) { highlightId = id; };
  vm.editItem = editItem;
  vm.deleteItem = model.deleteItem.bind(model, vm.graph);
  vm.rootItems = model.rootItems.bind(model, vm.graph);

  setupHotkeys();

  function editItem(item) { (map[item.type] || editConnection)(item); }

  function editActor(item) {
    editors.openActorModal(item)
      .then(model.saveActor.bind(model, vm.graph));
  }
  function editSystem (item) {
    editors.openSystemModal(item)
      .then(model.saveSystem.bind(model, vm.graph));
  }
  function editContainer (item) {
    editors.openContainerModal(vm.graph, item)
      .then(model.saveContainer.bind(model, vm.graph));
  }
  function editConnection(item) {
    editors.openConnectionModal(vm.graph, item)
      .then(model.saveConnection.bind(model, vm.graph));
  }
  function setupHotkeys() {
    [{
      combo:'a',
      description: 'add a new actor',
      callback: editActor
    },
     {
       combo:'s',
       description: 'add a new system',
       callback: editSystem
     },
     {
       combo:'c',
       description: 'add a new connection',
       callback: editConnection
     }
    ].map(hotkeys.add.bind(hotkeys));
  }

};
