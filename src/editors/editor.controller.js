const _ = require('lodash');

// @ngInject
module.exports = function(hotkeys, $state) {
  const vm = this;

  vm.addOptions = [
    makeAddOption('a', 'actor'),
    makeAddOption('s', 'system'),
    makeAddOption('c', 'connection'),
    makeAddOption('n', 'container')
  ];
  activate();

  function activate() {
    vm.addOptions.map(opts => hotkeys.add(opts));

    if($state.is('add')){
      vm.selectedItem = {type: $state.params.type};
    }else if(vm.item){
      vm.selectedItem = _.clone(vm.item);
    }

  }

  function makeAddOption(keychord, type) {
    return {
      combo: keychord,
      type: type,
      description: 'New ' + type,
      callback: () => $state.go('add', {type: type, id: vm.item && vm.item.id})
    };
  }
};
