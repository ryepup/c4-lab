// @ngInject
module.exports = function($window, $timeout, exporter) {
  var self = this,
      localStorage = $window.localStorage,
      key = 'C4-LAB-ACTIVE-DOC'
  ;

  self.load = load;
  self.save = save;

  function load() { return exporter.fromJson(localStorage.getItem(key) || 'null'); }
  function save(graph) {
    return $timeout(function() {
      var json = exporter.toJson(graph);
      localStorage.setItem(key, json);
    });
  }
}
