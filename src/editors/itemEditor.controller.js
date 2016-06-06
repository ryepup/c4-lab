const _ = require('lodash');

// @ngInject
module.exports = function(model, $state, $log) {
  const vm = this;
  vm.fieldTemplate = fieldTemplate;
  vm.save = save;
  vm.deleteItem = deleteItem;
  vm.cancel = back;

  activate();

  function fieldTemplate() {
    const type = vm.item.type || 'connection';
    return type + 'Form.html';
  }

  function save() {
    model.save(model.currentGraph, vm.item.type, vm.item);
    back();
  }

  function deleteItem() {
    model.deleteItem(model.currentGraph, vm.item);
    back();
  }

  function back() {
    if(vm.item.parentId){
      $state.go('edit', {id: vm.item.parentId});
    }else{
      $state.go('home');
    }
  }

  function activate() {
    if(model.isConnection(vm.item)){
      connectionConfig();
    }else if(vm.item && vm.item.type === 'container'){
      containerConfig();
    }
  }

  function containerConfig() {
    vm.systems = model.systems(model.currentGraph);
    vm.item.parent = model.findItem(model.currentGraph, vm.item.parentId);
  }

  function connectionConfig() {
    vm.sources = model.sources(model.currentGraph);
    vm.destinations = model.destinations.bind(model, model.currentGraph);
    vm.isDescriptionRequired = true;
    vm.nameFor = model.nameFor.bind(model, model.currentGraph);

    vm.item.source = _.find(vm.sources, 'id', vm.item.parentId)
      || _.find(vm.sources, 'id', vm.item.sourceId);

    vm.item.destination = model.findItem(model.currentGraph, vm.item.destinationId);

    vm.anchorSelected = function(source) {
      vm.isDescriptionRequired = !(model.isConnection(vm.source)
                                   || model.isConnection(vm.destination));
    };
  }


};
