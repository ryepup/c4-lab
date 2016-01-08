var exporter = require('./exporter/json');

// @ngInject
module.exports = function($window, $timeout, $interval) {
  var self = this,
      localStorage = $window.localStorage,
      key = 'C4-LAB-ACTIVE-DOC'
  ;

  self.load = load;
  self.save = save;
  self.saveEvery = saveEvery;

  function load() { return exporter.fromJson(localStorage.getItem(key) || 'null'); }
  function save(graph) {
    return $timeout(function() {
      var json = exporter.toJson(graph);
      localStorage.setItem(key, json);
      self.lastSaved = new Date();
    });
  }

  function saveEvery(graph, seconds) {
    return $interval(saveIfModified.bind(null, graph), seconds);
  }

  function saveIfModified(graph) {
    if(graph.lastModified > self.lastSaved){ save(graph); }
  }

};
