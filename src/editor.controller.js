var _ = require('lodash');

// @ngInject
module.exports = function(editors, model, hotkeys, autoSave) {
  var vm = this,
      highlightId,
      map = {
        actor: editActor,
        system: editSystem
      }
  ;

  vm.editActor = editActor;
  vm.editSystem = editSystem;
  vm.editConnection = editConnection;
  vm.edges = model.edges.bind(model, vm.graph);
  vm.isHighlighted = function(id) { return id === highlightId; };
  vm.highlight = function(id) { highlightId = id; };
  vm.editItem = editItem;

  setupHotkeys();

  function saveToStorage() {
    return autoSave.save(vm.graph)
      .then(function() { vm.lastSaved = new Date(); });
  }

  function editItem(item) { (map[item.type] || editConnection)(item); }

  function editActor(item) {
    editors.openActorModal(item)
      .then(model.saveActor.bind(model, vm.graph))
      .then(saveToStorage);
  }
  function editSystem (item) {
    editors.openSystemModal(item)
      .then(model.saveSystem.bind(model, vm.graph))
      .then(saveToStorage);
  }
  function editConnection(item) {
    editors.openConnectionModal(vm.graph, item)
      .then(model.saveConnection.bind(model, vm.graph))
      .then(saveToStorage);
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
