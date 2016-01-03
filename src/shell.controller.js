module.exports = function(model) {
  var vm = this;

  vm.graph = {};

  var sr = model.saveActor(vm.graph, {name: 'Sr. Devs'}),
      jr = model.saveActor(vm.graph, {name: 'Jr. Devs'}),
      c4 = model.saveSystem(vm.graph, {name: 'C4-Lab'});

  model.saveConnection(vm.graph, {
    source: sr,
    destination: c4,
    description: 'Create/Edit designs'
  });

  model.saveConnection(vm.graph, {
    source: jr,
    destination: c4,
    description: 'Read/Implement designs'
  });

};
