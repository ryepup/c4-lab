const toDOT = require('./dot'),
      Model = require('../model'),
      empty = require('./empty.dot'),
      simple = require('./simple.dot'),
      twoActors = require('./two-actors.dot')
;

describe('dot', function() {
  let model = new Model(),
      graph,
      hrefTo
  ;

  beforeEach(function() {
    model.currentGraph = graph = { edges: [], items: []};
    hrefTo = jasmine.createSpy();
  });

  it('renders empty graph', function() {
    expect(toDOT(hrefTo, graph)).toEqualTrimmed(empty);
  });

  it('renders one actor', function() {
    model.save(graph, 'actor', {name: 'foo', id: 1});
    expect(toDOT(hrefTo, graph)).toEqualTrimmed(simple);
  });

  it('renders two actors', function() {
    model.save(graph, 'actor', {name: 'foo', id: 1});
    model.save(graph, 'actor', {name: 'bar', id: 2});
    expect(toDOT(hrefTo, graph)).toEqualTrimmed(twoActors);
  });

});
