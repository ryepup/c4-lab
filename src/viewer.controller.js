// @ngInject
module.exports = function(exporter, $sce, model) {
  const vm = this;
  let lastRendered, lastRenderedId, svg = null;
  vm.toSVG = toSVG;

  function toSVG() {
    if(!shouldRender()) { return svg; }
    svg = $sce.trustAsHtml(exporter.toSVG(model.currentGraph, vm.rootItem));
    lastRendered = model.currentGraph.lastModified;
    lastRenderedId = rootItemId();
    return svg;
  }

  function shouldRender() {
    return svg === null
      || lastRenderedId !== rootItemId()
      || lastRendered !== model.currentGraph.lastModified;
  }

  function rootItemId() {
    return vm.rootItem && vm.rootItem.id;
  }
};
