var uuid = require('uuid'),
    _ = require('lodash');

module.exports = function() {
  var self = this;

  self.addActor = addItem.bind(null, 'actor');
  self.addSystem = addItem.bind(null, 'system');
  self.toJSON = JSON.stringify;
  self.parse = JSON.parse;
  self.addConnection = addConnection;
  self.sources = function(graph) { return graph.items || []; };
  self.destinations = destinations;
  self.edges = edges;


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

  function addItem(type, graph, item) {
    graph.items = graph.items || [];
    item.type = type;
    item.id = uuid.v4();
    graph.items.push(item);
    return item;
  }

  function addConnection(graph, item) {
    graph.edges = graph.edges || [];
    var edge = {
      id: uuid.v4(),
      sourceId: item.source.id,
      destinationId: item.destination.id,
      description: item.description
    };
    graph.edges.push(edge);
    return edge;
  }
};
