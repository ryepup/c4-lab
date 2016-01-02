describe('model', function() {
  var Model = require('./model'),
      model;
  beforeEach(function() { model = new Model(); });

  describe('addActor', function() {
    var graph, actor;
    beforeEach(function() {
      graph = {};
      actor = {name: 'test'};
    });

    it('adds to the graph', function() {
      model.addActor(graph, actor);
      expect(graph.items[0]).toBe(actor);
    });

    it('adds to the end of the graph items', function() {
      graph.items = [1,2,3];
      model.addActor(graph, actor);
      expect(graph.items[3]).toBe(actor);
    });

    it('decorates the input with id + type', function() {
      model.addActor(graph, actor);
      expect(actor.type).toBe('actor');
      expect(actor.id).toBeDefined();
    });
  });

});
