var _ = require('lodash');

// @ngInject
module.exports = function(model, editors) {
  var vm = this, dests = [];
  Object.defineProperty(
    vm, "name",
    { get: model.edgeDescription.bind(model, vm.graph, vm.item) });

  // getting infinite digests if I try to pass back a DTO with the
  // edge and the destination, not sure why... decorating with
  // defineProperty is neat, but I'd prefer a simpler option
  vm.edges = function() { return edges().map(addDestination); };

  function edges(id) {
    id = id || vm.item;
    var children = model.children(vm.graph, id);
    return _([id])
      .concat(children.map(edges))
      .flatten()
      .value();
  }

  function addDestination(edge) {
    var d = model.findItem(vm.graph, edge.destinationId);
    Object.defineProperty(edge, "dest", { value: d });
    return edge;
  }
};
