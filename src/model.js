var uuid = require('uuid'),
    _ = require('lodash');

module.exports = function() {
  var self = this;

  self.sources = sources;
  self.destinations = destinations;
  self.edges = edges;
  self.findItem = function(graph, id) { return byId(graph.items, id); };
  self.deleteItem = deleteItem;
  self.systems = _.partialRight(sources, 'system');
  self.children = function(graph, item) {
    return _.select(graph.items||[], 'parentId', item.id);
  };
  self.rootItems = function(graph) {
    return _.select(graph.items, function(item) { return !item.parentId; });
  };
  self.save = save;

  function save(graph, type, item) {
    graph.items = graph.items || [];
    graph.edges = graph.edges || [];

    var addTo = graph.edges;
    if(type && type !== 'connection'){
      addTo = graph.items;
      item.type = type;
    }
    else {
      item.sourceId = item.source.id;
      item.destinationId = item.destination.id;
      delete item.source;
      delete item.destination;
    }
    var result = findOrCreate(addTo, item);
    graph.lastModified = new Date();
    return result;
  }

  function sources(graph, type) {
    var items = graph.items || [];
    return type ? _.select(items, 'type', type) : items;
  }

  function deleteItem(graph, item) {
    if(item.type){
      graph.items = _.reject(graph.items || [], 'id', item.id);
      graph.edges = _.reject(graph.edges || [],
                           function(edge) {
                             return edge.sourceId === item.id
                               || edge.destinationId === item.id;
                           });}
    else{
      graph.edges = _.reject(graph.edges || [], 'id', item.id);
    }
    graph.lastModified = new Date();
  }

  function edges(graph, itemOrId) {
    var result = graph.edges || [],
        id = _.isString(itemOrId)
          ? itemOrId
          : (itemOrId && itemOrId.id);

    if(!id){ return result; }

    return result.filter(function(edge) {
      return edge.sourceId === id || edge.destinationId === id;
    });
  }

  function destinations(graph, sourceId) {
    return sourceId
      ? _.reject(sources(graph), 'id', sourceId)
      : [];
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

  function byId(collection, id) { return collection && id ? _.find(collection, 'id', id) : null; }
};
