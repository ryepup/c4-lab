var map = {
  actor: 'user',
  system: 'cloud',
  connection: 'flash'
};

module.exports = function() {
  var vm = this;
  vm.icon = map[vm.type];
};
