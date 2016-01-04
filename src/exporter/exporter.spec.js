describe('exporter', function() {
  var Exporter = require('../exporter'),
      Model = require('../model'),
      model = new Model(),
      graph, exporter;

  beforeEach(function() { exporter = new Exporter(); });

  describe('toDOT', function() {
    beforeEach(function() {
      graph = {};
    });

    it('renders empty graph', function() {
      expect(exporter.toDOT(graph).trim())
        .toBe(require('./empty.dot').trim());
    });

    it('renders one actor', function() {
      model.saveActor(graph, {name: 'foo'});
      expect(exporter.toDOT(graph).trim())
        .toBe(require('./simple.dot').trim());
    });

    it('renders two actors', function() {
      model.saveActor(graph, {name: 'foo'});
      model.saveActor(graph, {name: 'bar'});
      expect(exporter.toDOT(graph).trim())
        .toBe(require('./two-actors.dot').trim());
    });
  });
});
