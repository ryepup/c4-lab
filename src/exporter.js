module.exports = function() {
  var self = this;

  self.toJSON = toJSON;
  self.toDOT = toDOT;

  /**
   * @return string serialized graph as JSON
   */
  function toJSON(graph) { throw new Error('Not implemented'); }

  /**
   * @return string serialized graph in graphviz DOT
   */
  function toDOT(graph) { throw new Error('Not implemented'); }
};
