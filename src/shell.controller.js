// @ngInject
module.exports = function(autoSave, exporter) {
  var vm = this;

  vm.graph = autoSave.load()
    || exporter.fromJson(require('./exporter/c4-lab.json'));

  autoSave.saveEvery(vm.graph, 5000);
};
