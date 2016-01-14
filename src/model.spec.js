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

  describe('save', function() {
    'actor system container component'.split(' ')
      .map(function(t) {
        it('handles `'+t+'` nodes', function() {
          var item = {name: 'whatever'};
          model.save(graph, t, item);
          expect(item.id).toBeDefined();
          expect(item.type).toBe(t);
          expect(graph.items[0]).toBe(item);
        });
      });

    it('handles connections', function() {
      var item = {name: 'whatever', source: {id:1}, destination: {id: 2}};

      model.save(graph, 'connection', item);

      expect(item.id).toBeDefined();
      expect(item.sourceId).toBeDefined();
      expect(item.destinationId).toBeDefined();
      expect(item.source).toBeUndefined();
      expect(item.destination).toBeUndefined();
      expect(graph.edges[0]).toBe(item);
    });

    it('assumes no type means connection', function() {
      var item = {name: 'whatever', source: {id:1}, destination: {id: 2}};

      model.save(graph, undefined, item);

      expect(graph.edges[0]).toBe(item);
    });

    it('updates an existing item by id', function() {
      var actor = {name: 'foo'};
      model.save(graph, 'actor', actor);
      var copy = _.clone(actor);
      copy.name += 'asdf';
      model.save(graph, 'actor', copy);
      expect(actor).toEqual(copy);
      expect(graph.items.length).toBe(1);
    });


  });

  it('finds children', function() {
    var system = {name: 'sys'};
    model.save(graph, 'system', system);
    var container = {name: 'foo', parentId: system.id};
    model.save(graph, 'container', container);

    expect(model.children(graph, system)).toEqual([container]);
  });

  describe('deleteItem', function() {
    it('removes the item', function() {
      var actor = {name: 'test'};
      model.save(graph, 'actor', actor);
      expect(graph.items.length).toBe(1);
      model.deleteItem(graph, actor);
      expect(graph.items.length).toBe(0);
    });

    it('updates lastModified', function() {
      var actor = {name: 'test'};
      model.save(graph, 'actor', actor);
      delete graph.lastModified;
      model.deleteItem(graph, actor);
      expect(graph.lastModified).toBeDefined();
    });

    it('removes related connections to a source', function() {
      model.deleteItem(c4LabGraph, {id: 'b9815283-4bea-4124-afc7-018c347ea1a2', type:'actor'});
      expect(c4LabGraph.edges.length).toBe(3);
    });

    it('removes related connections to a destination', function() {
      model.deleteItem(c4LabGraph, {id: '10cffdf2-901e-4072-8150-a059a836967d', type:'system'});
      expect(c4LabGraph.edges.length).toBe(2);
    });

  });

  describe('destinations', function() {
    it('returns eligible items', function() {
      var id = '10cffdf2-901e-4072-8150-a059a836967d';
      var dests = model.destinations(c4LabGraph, id);
      expect(dests.length).toBe(4);
      expect(_.pluck(dests, 'id')).not.toContain(id);
    });

    it('returns empty list with no input', function() {
      var dests = model.destinations(c4LabGraph, undefined);
      expect(dests.length).toBe(0);
    });
  });

  describe('edges', function() {
    it('can find by id', function() {
      var edges = model.edges(c4LabGraph, '803dfe63-eb75-4720-8587-86313d48bed1');
      expect(edges.length).toBe(3);
    });

    it('can find by item', function() {
      var github = model.findItem(c4LabGraph, '803dfe63-eb75-4720-8587-86313d48bed1');
      var edges = model
            .edges(c4LabGraph, github);
      expect(edges.length).toBe(3);
    });

    it('returns all if no criteria is passed', function() {
      var edges = model.edges(c4LabGraph);
      expect(edges).toBe(c4LabGraph.edges);
    });

  });
});
