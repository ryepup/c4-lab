var _ = require('lodash');

/**
 * @return string serialized graph in graphviz DOT
 */
function toDOT(graph) {
  var lines = ['digraph g {', '  compound=true'],
      nodeId = 0,
      idMap = {};

  // sort so we get consistent output
  _.sortBy(graph.items || [], 'id')
    .map(function(item) {
      var id = idMap[item.id] = nodeId++;
      lines.push('  subgraph cluster' + id +' {');
      lines.push('    label=<<B>' + item.name+ '</B><BR/><FONT POINT-SIZE="12" COLOR="#666666"><I>&#171;'+item.type+'&#187;</I></FONT>>');
      lines.push('    g' + id + ' [shape=plaintext label="' + sanitize(item.description) + '"]');
      lines.push('  }');
    });

  if(graph.edges) { lines.push('edge[fontsize=12 fontcolor="#666666"]'); }

  _.sortBy(graph.edges || [], 'id')
    .map(function(item) {
      lines.push(edgeToDOT(item, idMap));
    });

  lines.push('}');
  return lines.join('\n');
}

function sanitize(description) {
  return description
    ? description.replace('"', '\\"').replace(/\n/g, '\\l') + '\\l'
    : '';
}

function edgeToDOT(edge, idMap) {
  var srcId = idMap[edge.sourceId],
      dstId = idMap[edge.destinationId];

  return '  g' + srcId + ' -> g' + dstId + '[label="' + sanitize(edge.description) + '" ltail=cluster' + srcId + ' lhead=cluster' + dstId + ']';
};

module.exports = toDOT;
