var _ = require('lodash');

// @ngInject
module.exports = function(editors, model, hotkeys) {
  var vm = this;

  vm.children = model.children.bind(model, vm.graph);
  vm.rootItems = model.rootItems.bind(model, vm.graph);
  vm.addOptions = [
    makeAddOption('a', 'actor'),
    makeAddOption('s', 'system'),
    makeAddOption('c', 'connection'),
    makeAddOption('n', 'container')
  ];

  activate();

  function activate() {
    vm.addOptions
      .map(hotkeys.add.bind(hotkeys));
  }

  function makeAddOption(keychord, type) {
    return {
      combo: keychord,
      type: type,
      description: 'New ' + type,
      callback: function() { editors.openModal(type, vm.graph); }
    };
  }
};
