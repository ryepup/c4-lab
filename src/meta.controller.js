module.exports = function() {
  var vm = this;
  vm.version = process.env.npm_package_version;
  vm.build = process.env.TRAVIS_BUILD_NUMBER || 'SNAPSHOT';
  vm.hash = process.env.TRAVIS_COMMIT || process.env.npm_package_gitHead;
};
