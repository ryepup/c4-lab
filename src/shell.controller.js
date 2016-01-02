module.exports = function(model) {
  var vm = this;

  vm.graph = {};

  var sr = model.addActor(vm.graph, {name: 'Sr. Devs'}),
      jr = model.addActor(vm.graph, {name: 'Jr. Devs'}),
      c4 = model.addSystem(vm.graph, {name: 'C4-Lab'});

  model.addConnection(vm.graph, {
    source: sr,
    destination: c4,
    description: 'Create/Edit designs'
  });

  model.addConnection(vm.graph, {
    source: jr,
    destination: c4,
    description: 'Read/Implement designs'
  });

};
