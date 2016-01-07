var uuid = require('uuid'),
    _ = require('lodash');

module.exports = function() {
  var self = this;

  self.saveActor = saveItem.bind(null, 'actor');
  self.saveSystem = saveItem.bind(null, 'system');
  self.toJSON = JSON.stringify;
  self.parse = JSON.parse;
  self.saveConnection = saveConnection;
  self.sources = function(graph) { return graph.items || []; };
  self.destinations = destinations;
  self.edges = edges;
  self.findItem = function(graph, id) { return byId(graph.items, id); };

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
    return findOrCreate(graph.items, item);
  }

  function saveConnection(graph, item) {
    graph.edges = graph.edges || [];
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
