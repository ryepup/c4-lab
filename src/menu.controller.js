var _ = require('lodash'),
    util = require('./util');

// @ngInject
module.exports = function(autoSave, exporter, model) {
  var vm = this,
      jsonFormat = _.find(exporter.formats, 'extension', 'json');

  util.addProxyGetter(vm, autoSave, 'lastSaved');
  util.addProxyGetter(vm, model, 'currentGraph', 'graph');

  vm.exportFormats = _.without(exporter.formats, jsonFormat);
  vm.saveToStorage = autoSave.save.bind(autoSave, model.currentGraph);
  vm.save = save;

  function save(format) {
    exporter.saveFile(model.currentGraph, format || jsonFormat);
  }

};
