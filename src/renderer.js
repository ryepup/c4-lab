var Viz = require('viz.js');

module.exports = function(exporter) {
  var self = this;

  self.toSVG = toSVG;

  /**
   * @return string serialized graph as SVG
   */
  function toSVG(graph) {
    return Viz(exporter.toDOT(graph), { format:"svg", engine:"dot" });
  }
};
