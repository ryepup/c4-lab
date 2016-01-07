var Viz = require('viz.js');

module.exports = function() {
  var self = this;
  self.toDOT = require('./dot');
  self.toJson = JSON.stringify;
  self.fromJson = JSON.parse;
  self.toSVG = toSVG;

  function toSVG(graph) {
    return Viz(self.toDOT(graph), { format:"svg", engine:"dot" });
  }
};
