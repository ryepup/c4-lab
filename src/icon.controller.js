var map = {
  actor: 'user',
  system: 'cloud',
  connection: 'flash',
  container: 'home'
};

module.exports = function() {
  var vm = this;
  vm.icon = map[vm.type];
};
