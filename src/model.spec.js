const Model = require('./model'),
    _ = require('lodash'),
    exporter = require('./exporter/json'),
    sampleC4 = require('./exporter/c4-lab.json')
;


describe('model', function() {
  let model, graph, c4LabGraph;

  beforeEach(function() {
    model = new Model();
    graph = {};
    const c4 = c4LabGraph = exporter.fromJson(sampleC4);
    c4.github = model.findItem(c4, '803dfe63-eb75-4720-8587-86313d48bed1');
    c4.c4Lab = model.findItem(c4, '10cffdf2-901e-4072-8150-a059a836967d');
    c4.devs = model.findItem(c4, 'b9815283-4bea-4124-afc7-018c347ea1a2');
    c4.c4Lab.UI = model.findItem(c4, '119c4954-fb15-4b65-ad79-2945425991a6');
  });

  describe('sources', function() {
    let actor, system;

    beforeEach(function() {
      actor = model.save(graph, 'actor', {});
      system = model.save(graph, 'system', {});
    });

    it('returns empty if no items or edges', function() {
      expect(model.sources({})).toEqual([]);
    });

    it('returns top-level actors and systems', function() {
      const r = model.sources(graph);
      expect(r.length).toBe(2);
    });

    it('ignore top level connections when there are no children', function() {
      model.save(graph, 'connection', {source: actor, destination: system});

      const r = model.sources(graph);
      expect(r.length).toBe(2);
    });

    it('includes top-level connections when children exist', function() {
      const conn = model.save(graph, 'connection',
              {source: actor, destination: system}),
            kid = model.save(graph, 'container', {parentId: system.id});

      const r = model.sources(graph);
      expect(r.length).toBe(4);
      expect(r).toContain(conn);
      expect(r).toContain(kid);
    });

    it('includes siblings', function() {
      const kid = model.save(graph, 'container', {parentId: system.id}),
          kid2 = model.save(graph, 'container', {parentId: system.id});

      const r = model.sources(graph);
      expect(r.length).toBe(4);
      expect(r).toContain(kid);
      expect(r).toContain(kid2);
    });
  });

  describe('save', function() {
    'actor system container component'.split(' ')
      .map(function(t) {
        it('handles `'+t+'` nodes', function() {
          const item = {name: 'whatever'};
          model.save(graph, t, item);
          expect(item.id).toBeDefined();
          expect(item.type).toBe(t);
          expect(graph.items[0]).toBe(item);
        });
      });

    it('handles connections', function() {
      const item = {
        name: 'whatever',
        source: {id:1, type:'system'},
        destination: {id: 2, type:'actor'}
      };

      model.save(graph, 'connection', item);

      expect(item.id).toBeDefined();
      expect(item.sourceId).toBeDefined();
      expect(item.destinationId).toBeDefined();
      expect(item.source).toBeUndefined();
      expect(item.destination).toBeUndefined();
      expect(graph.edges[0]).toBe(item);
    });

    it('assumes no type means connection', function() {
      const item = {name: 'whatever', source: {id:1}, destination: {id: 2}};

      model.save(graph, undefined, item);

      expect(graph.edges[0]).toBe(item);
    });

    it('updates an existing item by id', function() {
      const actor = {name: 'foo'};
      model.save(graph, 'actor', actor);
      const copy = _.clone(actor);
      copy.name += 'asdf';
      model.save(graph, 'actor', copy);
      expect(actor).toEqual(copy);
      expect(graph.items.length).toBe(1);
    });

    it('saves connections to connections', function() {
      const actor = model.save(graph, 'system', { name: 'actor' }),
            root = model.save(graph, 'system', { name: 'root' }),
            child = model.save(graph, 'container',
              { name: 'child', parent: root }),
            rootUsesActor = model.save(graph, 'connection',
              { source: root, destination: actor, description: 'uses' }),
            conn = model.save(graph, 'connection',
              { source: child, destination: rootUsesActor });

      expect(conn.sourceId).toBe(child.id);
      expect(conn.parentId).toBe(rootUsesActor.id);
      expect(conn.destinationId).toBe(actor.id);
    });
  });

  it('finds children', function() {
    const system = {name: 'sys'};
    model.save(graph, 'system', system);
    const container = {name: 'foo', parentId: system.id};
    model.save(graph, 'container', container);

    expect(model.children(graph, system)).toEqual([container]);
  });

  describe('deleteItem', function() {
    it('removes the item', function() {
      const actor = {name: 'test'};
      model.save(graph, 'actor', actor);
      expect(graph.items.length).toBe(1);
      model.deleteItem(graph, actor);
      expect(graph.items.length).toBe(0);
    });

    it('updates lastModified', function() {
      const actor = {name: 'test'};
      model.save(graph, 'actor', actor);
      delete graph.lastModified;
      model.deleteItem(graph, actor);
      expect(graph.lastModified).toBeDefined();
    });

    it('removes related connections to a source', function() {
      model.deleteItem(c4LabGraph, c4LabGraph.devs);
      expect(c4LabGraph.edges.length).toBe(3);
    });

    it('removes related connections to a destination', function() {
      model.deleteItem(c4LabGraph, c4LabGraph.c4Lab);
      expect(c4LabGraph.edges.length).toBe(2);
    });

  });

  describe('destinations', function() {
    it('returns eligible items', function() {
      const dests = model.destinations(c4LabGraph, c4LabGraph.c4Lab.id);
      expect(dests.length).toBe(3);
      expect(_.pluck(dests, 'id')).not.toContain(c4LabGraph.c4Lab.id);
    });

    it('returns empty list with no input', function() {
      const dests = model.destinations(c4LabGraph, undefined);
      expect(dests.length).toBe(0);
    });

    it('restricts types, actor-to-system', function() {
      const dests = model.destinations(c4LabGraph, c4LabGraph.devs);
      expect(dests.length).toBe(3);
      const types = _(dests).pluck('type').uniq().value();
      expect(types).toEqual(['system']);
    });

    it('returns children if given a connection', function() {
      const conn = model.save(c4LabGraph,'connection',
              { source: c4LabGraph.github, destination: c4LabGraph.c4Lab }),
            dests = model.destinations(c4LabGraph, conn);

      expect(dests).toEqual([c4LabGraph.c4Lab.UI]);
    });

    it('returns siblings if given a child', function() {
      const child = model.save(c4LabGraph, 'container',
              {parent: c4LabGraph.c4Lab }),
            dests = model.destinations(c4LabGraph, child);

      expect(dests.length).toBe(4);
      expect(dests).toContain(c4LabGraph.c4Lab.UI);
      expect(dests).not.toContain(c4LabGraph.c4Lab);
      expect(dests).not.toContain(child);
    });
    it('returns outgoing connections if given a child', function() {
      const child = model.save(c4LabGraph, 'container',
              {parent: c4LabGraph.c4Lab }),
            conn = model.save(c4LabGraph,'connection',
              {source:c4LabGraph.c4Lab, destination: c4LabGraph.github}),
            dests = model.destinations(c4LabGraph, child);

      expect(dests).toContain(conn);
    });
  });

  describe('edges', function() {
    it('can find by id', function() {
      const edges = model.edges(c4LabGraph, c4LabGraph.github.id);
      expect(edges.length).toBe(3);
    });

    it('can find by item', function() {
      const edges = model.edges(c4LabGraph, c4LabGraph.github);
      expect(edges.length).toBe(3);
    });

    it('returns all if no criteria is passed', function() {
      const edges = model.edges(c4LabGraph);
      expect(edges).toBe(c4LabGraph.edges);
    });

  });

  describe('nameFor', function() {
    let root, child, actor, rootUsesActor;
    beforeEach(function() {
      actor = model.save(graph, 'system', {name:'actor'});
      root = model.save(graph, 'system', {name:'root'});
      child = model.save(graph, 'container', {name: 'child', parent: root});
      rootUsesActor = model.save(graph, 'connection',
        {source:root, destination: actor, description: 'uses'});
    });

    it('supports item', function() {
      expect(model.nameFor(graph, root)).toBe('root');
    });

    it('supports item by id', function() {
      expect(model.nameFor(graph, root.id)).toBe('root');
    });

    it('supports children', function() {
      expect(model.nameFor(graph, child)).toBe('root.child');
    });

    it('supports connections', function() {
      expect(model.nameFor(graph, rootUsesActor))
        .toBe('root -> uses -> actor');
    });

    it('supports connections by id', function() {
      expect(model.nameFor(graph, rootUsesActor.id))
        .toBe('root -> uses -> actor');
    });
  });
});
