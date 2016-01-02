module.exports = function() {
  var self = this;
  self.toDOT = toDOT;

  /**
   * @return string serialized graph in graphviz DOT
   */
  function toDOT(graph) {
    var lines = ['digraph g {'],
        nodeId = 0,
        idMap = {};

    (graph.items || [])
      .map(function(item) {
        idMap[item.id] = nodeId++;
        lines.push(itemToDOT(item, idMap[item.id]));
      });

    (graph.edges || [])
      .map(function(item) {
        lines.push(edgeToDOT(item, idMap));
      });

    lines.push('}');
    return lines.join('\n');
  }

  function itemToDOT(item, id) {
    return '  g' + id + ' [shape=record label="{'+ item.name + ' | &#171; '+item.type+' &#187; }"]';
  };

  function edgeToDOT(edge, idMap) {
    return '  g' + idMap[edge.sourceId] + ' -> g' + idMap[edge.destinationId] + '[label="' + edge.description + '"]';
  };
};
