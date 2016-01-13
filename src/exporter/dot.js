var _ = require('lodash'),
    wordwrap = require('wordwrap')(30),
    Model = require('../model'),
    model = new Model(),
    itemDOTTemplate = _.template(require('./item.template.dot')),
    edgeDOTTemplate = _.template(require('./edge.template.dot')),
    zoomedDOTTemplate = _.template(require('./zoomed.template.dot'))

;

function edgeDOT(edge, idMap) {
  return edgeDOTTemplate({
    sourceId: idMap[edge.sourceId],
    destId: idMap[edge.destinationId],
    description: sanitize(edge.description)
  });
}


function itemDOT(item, id, desc) {
  return itemDOTTemplate({
    id: id,
    name: item.name,
    type: item.type,
    description: desc || sanitize(item.description)
  });
}

function contextDOT(graph, lines) {
  var nodeId = 0, idMap = {};

  model.rootItems(graph)
    .map(function(item) {
      var id = idMap[item.id] = nodeId++;
      lines.push(itemDOT(item, id));
    });

  (graph.edges || [])
    .map(function(item) {
      lines.push(edgeDOT(item, idMap));
    });
}

function zoomedDOT(graph, rootItem, lines) {
  var nodeId = 0,
      idMap = {},
      edges = graph.edges
        .filter(function(edge) {
          return edge.sourceId === rootItem.id || edge.destinationId === rootItem.id;
        }),
      itemIds = _.chain(edges)
        .map(function(edge) { return [edge.sourceId, edge.destinationId]; })
        .flatten()
        .filter(function(id) { return id !== rootItem.id; })
        .uniq()
        .value(),
      nodes = graph.items
        .filter(function(item) { return _.includes(itemIds, item.id);}),
      children = model.children(graph, rootItem);

  idMap[rootItem.id] = 'Root';

  lines.push(zoomedDOTTemplate({
    name: rootItem.name,
    description: sanitize(rootItem.description),
    children: children
      .map(function(item) {
        var id = idMap[item.id] = nodeId++;
        return itemDOT(item, id);
      })
      .join('\n')
  }));
  nodes.map(function(item) {
    var id = idMap[item.id] = nodeId++;
    lines.push(itemDOT(item, id, ""));
  });

  edges.map(function(edge) {
    lines.push(edgeDOT(edge, idMap));
  });

}

/**
 * @return string serialized graph in graphviz DOT
 */
function toDOT(graph, rootItem) {
  var lines = ['digraph g {', '  compound=true'];

  if(graph.edges && graph.edges.length) {
    lines.push('edge[fontsize=12 fontcolor="#666666"]');
  }

  if(rootItem) { zoomedDOT(graph, rootItem, lines); }
  else { contextDOT(graph, lines); }

  lines.push('}');
  return lines.join('\n');
}

function sanitize(description) {
  return description
    ? wordwrap(description).replace('"', '\\"').replace(/\n/g, '\\l') + '\\l'
    : '';
}

module.exports = toDOT;
