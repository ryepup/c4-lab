// @ngInject
module.exports = function(model, autoSave, exporter) {
  var vm = this;

  vm.graph = autoSave.load()
    || exporter.fromJson(require('./exporter/c4-lab.json'));
};
