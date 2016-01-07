describe('dot', function() {
  var toDOT = require('./dot'),
      Model = require('../model'),
      model = new Model(),
      graph
  ;

  beforeEach(function() { graph = {}; });

  it('renders empty graph', function() {
    expect(toDOT(graph)).toEqualTrimmed(require('./empty.dot'));
  });

  it('renders one actor', function() {
    model.saveActor(graph, {name: 'foo', id: 1});
    expect(toDOT(graph)).toEqualTrimmed(require('./simple.dot'));
  });

  it('renders two actors', function() {
    model.saveActor(graph, {name: 'foo', id: 1});
    model.saveActor(graph, {name: 'bar', id: 2});
    expect(toDOT(graph)).toEqualTrimmed(require('./two-actors.dot'));
  });
});
