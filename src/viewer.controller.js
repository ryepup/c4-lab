// @ngInject
module.exports = function(exporter, $sce) {
  var vm = this;
  vm.toSVG = toSVG;

  function toSVG() {
    return $sce.trustAsHtml(exporter.toSVG(vm.graph));
  }
};
