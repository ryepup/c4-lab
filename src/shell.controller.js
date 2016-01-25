
// @ngInject
module.exports = function(model) {
  var vm = this;

  Object.defineProperty(vm, 'graph', { get: function() { return model.currentGraph; } });
  vm.rootItem = findRootItem();

  function findRootItem() {
    if(!vm.item || model.isConnection(vm.item)) return null;

    if(model.children(vm.graph, vm.item).length > 0){
      return vm.item;
    }else if(vm.item.parentId){
      return model.findItem(vm.graph, vm.item.parentId);
    }
    return null;
  }
};
