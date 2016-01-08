var Viz = require('viz.js'),
    json = require('./json');

// @ngInject
module.exports = function($window, $q) {
  var self = this,
      document = $window.document
  ;

  self.toDOT = require('./dot');
  self.toJson = json.toJson;
  self.fromJson = json.fromJson;
  self.toSVG = toSVG;
  self.toPNG = toPNG;

  function toSVG(graph) {
    return Viz(self.toDOT(graph), { format:"svg", engine:"dot" });
  }

  function toPNG(graph) {
    var svg = toSVG(graph),
        img = document.createElement("img")
    ;
    return $q(function(resolve, reject) {
      img.onload = function() { resolve(getPNGDataURL(img)); };
      img.setAttribute("src", "data:image/svg+xml," + encodeURIComponent(svg));
    });
  }

  function getPNGDataURL(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext("2d")
      .drawImage(img, 0, 0);
    return canvas.toDataURL("image/png");
  }
};
