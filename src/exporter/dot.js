var _ = require('lodash'),
    wordwrap = require('wordwrap')(30),
    Model = require('../model'),
    model = new Model(),
    itemDOTTemplate = _.template(require('./item.template.dot')),
    containerDOTTemplate = _.template(require('./container.template.dot')),
    edgeDOTTemplate = _.template(require('./edge.template.dot')),
    zoomedDOTTemplate = _.template(require('./zoomed.template.dot')),
    templates = {
      actor: itemDOTTemplate,
      system: itemDOTTemplate,
      container: containerDOTTemplate
    }

;

function edgeDOT(graph, edge, idMap) {
  return edgeDOTTemplate({
    sourceId: idMap[edge.sourceId],
    destId: idMap[edge.destinationId],
    description: sanitize(model.edgeDescription(graph, edge))
  });
}


function itemDOT(item, id, desc) {
  var vm = _.extend({}, item, {
    description: desc || sanitize(item.description),
    id: id
  });

  return templates[item.type](vm);
}

function contextDOT(graph, lines) {
  var nodeId = 0, idMap = {};

  _(model.rootItems(graph))
    .forEach(function(item) {
      var id = idMap[item.id] = nodeId++;
      lines.push(itemDOT(item, id));
    })
    .map(model.edges.bind(model, graph))
    .flatten()
    .uniq('id')
    .filter(function(edge) { return !edge.parentId; })
    .forEach(function(item) { lines.push(edgeDOT(graph, item, idMap)); })
    .value();
}

function zoomedDOT(graph, rootItem, lines) {
  var nodeId = 0,
      idMap = {},
      children = model.children(graph, rootItem),
      childEdges = _(children)
        .map(model.edges.bind(model, graph))
        .uniq('id')
        .flatten()
        .value(),
      edges = model.edges(graph, rootItem)
        .filter(function(edge) {
          return !_.any(childEdges, 'parentId', edge.id);
        })
        .concat(childEdges),
      itemIds = _(edges)
        .map(function(edge) { return [edge.sourceId, edge.destinationId]; })
        .flatten().uniq().value(),
      nodes = graph.items
        .filter(function(item) {
          return item !== rootItem
            && item.parentId !== rootItem.id
            && _.includes(itemIds, item.id);
        })
;

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
    lines.push(edgeDOT(graph, edge, idMap));
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
