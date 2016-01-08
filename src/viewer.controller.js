// @ngInject
module.exports = function(exporter, $sce) {
  var vm = this, lastRendered, svg;
  vm.toSVG = toSVG;

  function toSVG() {
    if(svg && lastRendered === vm.graph.lastModified) return svg;

    svg = $sce.trustAsHtml(exporter.toSVG(vm.graph));
    lastRendered = vm.graph.lastModified;
    return svg;
  }
};
