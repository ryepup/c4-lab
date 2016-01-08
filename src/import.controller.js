var _ = require('lodash');
var exporter = require('./exporter/json');

// @ngInject
module.exports = function($q) {
  var vm = this;
  vm.importJSON = importJSON;

  function importJSON(files) {
    readAsText(files[0]).then(restoreGraph);
  }

  function restoreGraph(json) {
    var g = exporter.fromJson(json);
    _.assign(vm.graph, g);
  }

  function readAsText(file) {
    var reader = new FileReader();
    return $q(function(resolve, reject) {
      reader.onload = function(loadEvt) { resolve(loadEvt.target.result); };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
};
