const map = {
  actor: 'user',
  system: 'cloud',
  connection: 'flash',
  container: 'home'
};

module.exports = function() {
  const vm = this;
  vm.icon = map[vm.type || 'connection'];
};
