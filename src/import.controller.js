const _ = require('lodash'),
      exporter = require('./exporter/json');

// @ngInject
module.exports = function($q, model) {
  const vm = this;
  vm.importJSON = importJSON;

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
