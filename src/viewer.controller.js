module.exports = function(renderer, $sce) {
  var vm = this;
  vm.toSVG = toSVG;

  function toSVG() {
    return $sce.trustAsHtml(renderer.toSVG(vm.graph));
  }
};
