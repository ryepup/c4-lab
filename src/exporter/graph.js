import * as _ from 'lodash'

export function edges(graph, itemOrId) {
  const result = graph.edges || [],
    id = idFor(itemOrId);

  if (!id) { return result; }

  return result
    .filter(edge => edge.sourceId === id || edge.destinationId === id);
}

export function edgeDescription(graph, edgeOrId) {
  if (!edgeOrId) throw new Error('must provide an edge or id');
  const edge = byId(graph.edges, edgeOrId);
  return edge.description || edgeDescription(graph, edge.parentId);
}

export function rootItems(graph) {
  return _.filter(graph.items || [], isOrphan);
}

export function children(graph, parentOrId) {
  const parentId = idFor(parentOrId);
  return _(graph.items)
    .concat(graph.edges)
    .filter('parentId', parentId)
    .value();
}

function byId(collection, itemOrId) {
  const id = idFor(itemOrId);
  return collection && id ? _.find(collection, 'id', id) : null;
}

function idFor(itemOrId) {
  return _.isString(itemOrId)
    ? itemOrId
    : itemOrId && itemOrId.id;
}


function isOrphan(item) { return !item.parentId; }

