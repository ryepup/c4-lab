const _ = require('lodash'),
      util = require('./util');

// @ngInject
module.exports = function(autoSave, exporter, model) {
  const vm = this,
      jsonFormat = _.find(exporter.formats, 'extension', 'json');

  util.addProxyGetter(vm, autoSave, 'lastSaved');
  util.addProxyGetter(vm, model, 'currentGraph', 'graph');

  vm.exportFormats = _.without(exporter.formats, jsonFormat);
  vm.saveToStorage = autoSave.save.bind(autoSave, model.currentGraph);
  vm.save = save;
  vm.importJSON = importJSON;

  function save(format) {
    exporter.saveFile(model.currentGraph, format || jsonFormat);
  }


  function importJSON(files) {
    readAsText(files[0]).then(restoreGraph);
  }

  function restoreGraph(json) {
    const g = exporter.fromJson(json);
    _.assign(model.currentGraph, g);
  }

  function readAsText(file) {
    const reader = new FileReader();
    return $q(function(resolve, reject) {
      reader.onload = loadEvt => resolve(loadEvt.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
};
