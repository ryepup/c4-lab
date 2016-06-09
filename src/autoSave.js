const exporter = require('./exporter/json');

// @ngInject
module.exports = function($window, $timeout, $interval, $log, model) {
  const self = this,
        localStorage = $window.localStorage,
        key = 'C4-LAB-ACTIVE-DOC'
  ;

  self.load = load;
  self.save = save;
  self.saveEvery = saveEvery;

  function load() {
    return exporter.fromJson(localStorage.getItem(key) || 'null');
  }
  function save() {
    return $timeout(function() {
      const json = exporter.toJson(model.currentGraph);
      localStorage.setItem(key, json);
      self.lastSaved = new Date();
      $log.info('saved', json.length, 'bytes at', self.lastSaved);
    });
  }

  function saveEvery(seconds) {
    return $interval(saveIfModified, seconds);
  }

  function saveIfModified() {
    if(!self.lastSaved || model.currentGraph.lastModified > self.lastSaved){
      save();
    }
  }
};
