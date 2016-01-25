var exporter = require('./exporter/json');

// @ngInject
module.exports = function($window, $timeout, $interval, $log) {
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
      $log.info('saved', json.length, 'bytes at', self.lastSaved);
    });
  }

  function saveEvery(graph, seconds) {
    return $interval(saveIfModified.bind(null, graph), seconds);
  }

  function saveIfModified(graph) {
    if(!self.lastSaved || graph.lastModified > self.lastSaved){ save(graph); }
  }

};
