module.exports = function() {
  var self = this;
  self.toDOT = require('./dot');
  self.toJson = JSON.stringify;
  self.fromJson = JSON.parse;
};
