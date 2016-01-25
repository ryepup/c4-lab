var uuid = require('uuid'),
    _ = require('lodash');

module.exports = function() {
  var self = this;

  self.sources = sources;
  self.destinations = destinations;
  self.edges = edges;
  self.findItem = function(graph, id) {
    return byId(graph.items, id)
      || byId(graph.edges, id);
  };
  self.deleteItem = deleteItem;
  self.systems = function(graph) {
    return _.filter(graph.items || [], 'type', 'system');
  };
  self.children = children;
  self.rootItems = rootItems;
  self.save = save;
  self.isConnection = isConnection;
  self.edgeDescription = edgeDescription;
  self.outgoingEdges = outgoingEdges;
  self.nameFor = nameFor;

  function nameFor(graph, itemOrId) {

    var id = idFor(itemOrId),
        item = byId(graph.items, id),
        edge = byId(graph.edges, id);

    if(item){
      return isOrphan(item) ? item.name
        : nameFor(graph, item.parentId) + '.' + item.name;
    }else if (edge){
      return [ nameFor(graph, edge.sourceId),
               edgeDescription(graph, edge),
               nameFor(graph, edge.destinationId)
             ].join(' -> ');
    }
    return null;
  }

  function outgoingEdges(graph, itemOrId) {
    if(!itemOrId) return [];

    return _.filter(edges(graph, itemOrId), 'sourceId', idFor(itemOrId));
  }

  function isOrphan(item) { return !item.parentId; }

  function edgeDescription(graph, edgeOrId) {
    if(!edgeOrId) throw new Error('must provide an edge or id');
    var edge = byId(graph.edges, edgeOrId);
    return edge.description || edgeDescription(graph, edge.parentId);
  }

  function rootItems(graph) {
    return _.filter(graph.items || [], isOrphan);
  }
  function children(graph, parentOrId) {
    var parentId = idFor(parentOrId);
    return _(graph.items)
      .concat(graph.edges)
      .filter('parentId', parentId)
      .value();
  }

  function save(graph, type, item) {
    graph.items = graph.items || [];
    graph.edges = graph.edges || [];

    var addTo = graph.edges;
    if(isConnection(type)){
      delete item.parentId;
      if(isConnection(item.source.type)){
        item.sourceId = item.source.sourceId;
        item.parentId = item.source.id;
      }else{
        item.sourceId = item.source.id;
      }

      if(isConnection(item.destination.type)){
        item.destinationId = item.destination.destinationId;
        item.parentId = item.destination.id;
      }else{
        item.destinationId = item.destination.id;
      }

      delete item.source;
      delete item.destination;
      item.type = 'connection';
    }
    else {
      addTo = graph.items;
      item.type = type;
      if(item.parent){
        item.parentId = item.parent.id;
        delete item.parent;
      }
    }
    var result = findOrCreate(addTo, item);
    graph.lastModified = new Date();
    return result;
  }

  function isConnection(typeOrItem) {
    if(!typeOrItem) return true;
    if(_.isString(typeOrItem)) return typeOrItem === 'connection';
    return isConnection(typeOrItem.type);
  }

  function sources(graph) {
    var kids = (graph.items || []).filter(function(item) { return item.parentId; }),
        parentMap = _.groupBy(kids, 'parentId'),
        edgesToParents = (graph.edges || [])
          .filter(function(edge) { return _.has(parentMap, edge.destinationId); });

    return rootItems(graph)
      .concat(edgesToParents)
      .concat(kids);
  }

  function deleteItem(graph, item) {
    if(isConnection(item.type)){
      graph.edges = _.reject(graph.edges, 'id', item.id);
      _(graph.edges)
        .filter('parentId', item.id)
        .forEach(deleteItem.bind(null, graph))
        .value();
    }
    else{
      graph.items = _.reject(graph.items || [], 'id', item.id);
      edges(graph, item).map(deleteItem.bind(null, graph));
    }
    graph.lastModified = new Date();
  }

  function edges(graph, itemOrId) {
    var result = graph.edges || [],
        id = idFor(itemOrId);

    if(!id){ return result; }

    return result.filter(function(edge) {
      return edge.sourceId === id || edge.destinationId === id;
    });
  }

  function destinations(graph, sourceItemOrId) {
    if(!sourceItemOrId) return [];

    var item = byId(graph.items, sourceItemOrId),
        edge = byId(graph.edges, sourceItemOrId);

    return item
      ? destinationsForItem(graph, item)
      : children(graph, edge.destinationId);

  }

  var eligibleTypes = {
    actor: ['system'],
    system: ['system', 'actor'],
    container: ['system', 'actor', 'container']
  };

  function destinationsForItem(graph, item) {
    var destTypes = eligibleTypes[item.type];

    return _(graph.items)
      .filter(function(candidate) { return candidate.id !== item.id; })
      .filter(function(candidate) { return candidate.id !== item.parentId; })
      .filter(function(candidate) { return _.includes(destTypes, candidate.type); })
      .value()
      .concat(outgoingEdges(graph, item.parentId));
  }

  function findOrCreate(collection, item) {
    var match = byId(collection, item.id);
    if(match){
      return _.assign(match, item);
    }else{
      _.assign(item, { id: item.id || uuid.v4() });
      collection.push(item);
      return item;
    }
  }

  function byId(collection, itemOrId) {
    var id = idFor(itemOrId);
    return collection && id ? _.find(collection, 'id', id) : null;
  }

  function idFor(itemOrId) {
    return _.isString(itemOrId)
      ? itemOrId
      : (itemOrId && itemOrId.id);
  }

  function itemFor(graph, itemOrId) {
    return _.isString(itemOrId)
      ? byId(graph.items, itemOrId)
      : itemOrId;
  }
};
