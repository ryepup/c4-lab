
// @ngInject
module.exports = function(exporter, $window, $q) {
  var vm = this;

  vm.formats = {
    json: saveAs.bind(null, 'application/json', exporter.toJson),
    dot: saveAs.bind(null, 'text/plain', exporter.toDOT),
    svg: saveAs.bind(null, 'image/svg+xml', exporter.toSVG),
    png: saveAs.bind(null, null, exporter.toPNG)
  };

  vm.saveAs = function(format) { vm.formats[format](format); };

  function saveAs(contentType, serializer, extension) {
    $q.when(serializer(vm.graph))
      .then(function(content) {
        var a = $window.document.createElement('a');
        a.download = (vm.graph.title || 'c4-graph') + '.' + extension;
        if(contentType){
          a.href = 'data:' + contentType + ',' + encodeURIComponent(content);
        } else {
          a.href = content;
        }
        a.click();
      });
  }
};
