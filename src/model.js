var uuid = require('uuid'),
    _ = require('lodash');

module.exports = function() {
  var self = this;

  self.saveActor = saveItem.bind(null, 'actor');
  self.saveSystem = saveItem.bind(null, 'system');
  self.saveContainer = saveItem.bind(null, 'container');
  self.toJSON = JSON.stringify;
  self.parse = JSON.parse;
  self.saveConnection = saveConnection;
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

  function sources(graph, type) {
    var items = graph.items || [];
    return type ? _.select(items, 'type', type) : items;
  };

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

  function edges(graph, item) {
    return _.chain(graph.edges || [])
      .filter('sourceId', item.id)
      .value();
  }

  function destinations(graph, item) {
    return item ?
      _.reject(self.sources(graph), 'id', item.id)
      : [];
  }

  function saveItem(type, graph, item) {
    graph.items = graph.items || [];
    item.type = type;
    graph.lastModified = new Date();
    return findOrCreate(graph.items, item);
  }

  function saveConnection(graph, item) {
    graph.edges = graph.edges || [];
    graph.lastModified = new Date();
    var edge = {
      id: item.id,
      sourceId: item.source.id,
      destinationId: item.destination.id,
      description: item.description
    };
    return findOrCreate(graph.edges, edge);
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
