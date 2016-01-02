var Viz = require('viz.js');

module.exports = function() {
  var self = this;

  self.toSVG = toSVG;

  /**
   * @return string serialized graph as SVG
   */
  function toSVG(graph) { throw new Error('Not implemented'); }
};
