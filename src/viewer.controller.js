// @ngInject
module.exports = function(exporter, $sce) {
  var vm = this, lastRendered, lastRenderedId, svg = null;
  vm.toSVG = toSVG;

  function toSVG() {
    if(!shouldRender()) { return svg; }
    svg = $sce.trustAsHtml(exporter.toSVG(vm.graph, vm.rootItem));
    lastRendered = vm.graph.lastModified;
    lastRenderedId = rootItemId();
    return svg;
  }

  function shouldRender() {
    return svg === null
      || lastRenderedId !== rootItemId()
      || lastRendered !== vm.graph.lastModified;
  }

  function rootItemId() {
    return (vm.rootItem && vm.rootItem.id);
  }
};
