module.exports = function() {
  var self = this;

  self.parse = parse;

  /**
   * @return fully formed graph ready for editing
   */
  function parse(json) { return JSON.parse(json); }
};
