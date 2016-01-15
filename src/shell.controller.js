var sampleC4 = require('./exporter/c4-lab.json');

// @ngInject
module.exports = function(autoSave, exporter, model) {
  var vm = this;

  vm.graph = autoSave.load()
    || exporter.fromJson(sampleC4);
  vm.rootItem = null;
  vm.itemSelected = itemSelected;
  vm.breadcrumbs = breadcrumbs;

  autoSave.saveEvery(vm.graph, 5000);


  function itemSelected(item) {
    if(model.children(vm.graph, item).length > 0){
      vm.rootItem = item;
    }
  }
  function breadcrumbs() {
    if(!vm.rootItem) return [];
    return [vm.rootItem];
  };
};
