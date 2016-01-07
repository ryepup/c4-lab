
// @ngInject
module.exports = function(exporter, $window) {
  var vm = this;

  vm.formats = {
        json: saveAs.bind(null, 'application/json', exporter.toJson),
        dot: saveAs.bind(null, 'text/plain', exporter.toDOT),
        svg: saveAs.bind(null, 'image/svg+xml', exporter.toSVG)
  };

  vm.saveAs = function(format) { vm.formats[format](format); };

  function saveAs(contentType, serializer, extension) {
    var a = $window.document.createElement('a'),
        content = serializer(vm.graph);
    a.download = 'c4-graph.' + extension;
    a.href = 'data:' + contentType + ',' + encodeURIComponent(content);
    a.click();
  }
};
