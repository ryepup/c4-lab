// @ngInject
module.exports = function(autoSave, exporter) {
  var vm = this;
  Object.defineProperty(vm, "lastSaved", { get: getLastSaved });
  Object.defineProperty(vm, "formats", { get: getFormats });
  vm.saveToStorage = autoSave.save.bind(autoSave, vm.graph);
  vm.saveFile = exporter.saveFile.bind(exporter, vm.graph);

  function getLastSaved() { return autoSave.lastSaved; }
  function getFormats() { return exporter.formats; }
};
