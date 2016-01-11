var _ = require('lodash');

// @ngInject
module.exports = function(autoSave, exporter) {
  var vm = this,
      jsonFormat = _.find(exporter.formats, 'extension', 'json');
  Object.defineProperty(vm, "lastSaved", { get: getLastSaved });
  vm.exportFormats = _.without(exporter.formats, jsonFormat);
  vm.saveToStorage = autoSave.save.bind(autoSave, vm.graph);
  vm.save = save;

  function save(format) {
    exporter.saveFile(vm.graph, format || jsonFormat);
  }

  function getLastSaved() { return autoSave.lastSaved; }
};
