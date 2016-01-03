describe('model', function() {
  var Model = require('./model'),
      _ = require('lodash'),
      model;
  beforeEach(function() { model = new Model(); });

  describe('saveActor', function() {
    var graph, actor;
    beforeEach(function() {
      graph = {};
      actor = {name: 'test'};
    });

    it('saves to the graph', function() {
      model.saveActor(graph, actor);
      expect(graph.items[0]).toBe(actor);
    });

    it('saves to the end of the graph items', function() {
      graph.items = [1,2,3];
      model.saveActor(graph, actor);
      expect(graph.items[3]).toBe(actor);
    });

    it('decorates the input with id + type', function() {
      model.saveActor(graph, actor);
      expect(actor.type).toBe('actor');
      expect(actor.id).toBeDefined();
    });

    it('updates the existing item by id', function() {
      model.saveActor(graph, actor);
      var copy = _.clone(actor);
      copy.name += 'asdf';
      model.saveActor(graph, copy);
      expect(actor).toEqual(copy);
      expect(graph.items.length).toBe(1);
    });
  });

});
