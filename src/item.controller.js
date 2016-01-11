
// @ngInject
module.exports = function(model, editors) {
  var vm = this;

  vm.addOrEdit = editors.openModal.bind(editors, vm.item.type, vm.graph, vm.item);
  vm.deleteItem = model.deleteItem.bind(model, vm.graph, vm.item);
};
