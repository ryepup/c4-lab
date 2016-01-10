var toDOT = require('./dot'),
    Model = require('../model'),
    empty = require('./empty.dot'),
    simple = require('./simple.dot'),
    twoActors = require('./two-actors.dot')
;

describe('dot', function() {
  var model = new Model(),
      graph
  ;

  beforeEach(function() { graph = {}; });

  it('renders empty graph', function() {
    expect(toDOT(graph)).toEqualTrimmed(empty);
  });

  it('renders one actor', function() {
    model.saveActor(graph, {name: 'foo', id: 1});
    expect(toDOT(graph)).toEqualTrimmed(simple);
  });

  it('renders two actors', function() {
    model.saveActor(graph, {name: 'foo', id: 1});
    model.saveActor(graph, {name: 'bar', id: 2});
    expect(toDOT(graph)).toEqualTrimmed(twoActors);
  });
});
