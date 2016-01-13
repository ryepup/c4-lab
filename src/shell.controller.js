var sampleC4 = require('./exporter/c4-lab.json');

// @ngInject
module.exports = function(autoSave, exporter) {
  var vm = this;

  vm.graph = autoSave.load()
    || exporter.fromJson(sampleC4);
  vm.rootItem = null;
  vm.itemSelected = itemSelected;
  vm.breadcrumbs = breadcrumbs;

  autoSave.saveEvery(vm.graph, 5000);


  function itemSelected(item) { vm.rootItem = item; }
  function breadcrumbs() {
    if(!vm.rootItem) return [];
    return [vm.rootItem];
  };
};
