// @ngInject
module.exports = function(model) {
  var vm = this;

  vm.outgoingEdges = model.outgoingEdges.bind(model, vm.graph);
};
