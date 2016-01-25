var util = require('./util');
// @ngInject
module.exports = function(model) {
  var vm = this;

  util.addProxyGetter(vm, model, 'currentGraph', 'graph');
  vm.rootItem = findRootItem();

  function findRootItem() {
    if(!vm.item || model.isConnection(vm.item)) return null;

    if(model.children(model.currentGraph, vm.item).length > 0){
      return vm.item;
    }else if(vm.item.parentId){
      return model.findItem(model.currentGraph, vm.item.parentId);
    }
    return null;
  }
};
