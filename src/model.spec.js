var Model = require('./model'),
    _ = require('lodash'),
    exporter = require('./exporter/json'),
    sampleC4 = require('./exporter/c4-lab.json')
;


describe('model', function() {
  var model, graph, c4LabGraph;

  beforeEach(function() {
    model = new Model();
    graph = {};
    c4LabGraph = exporter.fromJson(sampleC4);
  });

  it('finds children', function() {
    var system = {name: 'sys'};
    model.saveSystem(graph, system);
    expect(system.id).toBeDefined();
    var container = {name: 'foo', parentId: system.id};
    model.saveContainer(graph, container);

    expect(model.children(graph, system)).toEqual([container]);
  });

  describe('deleteItem', function() {
    it('removes the item', function() {
      var actor = {name: 'test'};
      model.saveActor(graph, actor);
      expect(graph.items.length).toBe(1);
      model.deleteItem(graph, actor);
      expect(graph.items.length).toBe(0);
    });

    it('updates lastModified', function() {
      var actor = {name: 'test'};
      model.saveActor(graph, actor);
      delete graph.lastModified;
      model.deleteItem(graph, actor);
      expect(graph.lastModified).toBeDefined();
    });

    it('removes related connections to a source', function() {
      model.deleteItem(c4LabGraph, {id: 'b9815283-4bea-4124-afc7-018c347ea1a2', type:'actor'});
      expect(c4LabGraph.edges.length).toBe(1);
    });

    it('removes related connections to a destination', function() {
      model.deleteItem(c4LabGraph, {id: '10cffdf2-901e-4072-8150-a059a836967d', type:'system'});
      expect(c4LabGraph.edges.length).toBe(0);
    });

  });

  describe('saveActor', function() {
    var actor;
    beforeEach(function() { actor = {name: 'test'}; });

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
