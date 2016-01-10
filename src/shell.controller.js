var sampleC4 = require('./exporter/c4-lab.json');

// @ngInject
module.exports = function(autoSave, exporter) {
  var vm = this;

  vm.graph = autoSave.load()
    || exporter.fromJson(sampleC4);

  autoSave.saveEvery(vm.graph, 5000);
};
