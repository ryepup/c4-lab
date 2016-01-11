var EditorController = require('./editor.controller'),
    Model = require('./model');

describe('editor.controller', function() {
  var ctrl, mockEditors, model, mockHotkeys;
  beforeEach(function() {
    mockEditors = jasmine.createSpyObj('mockEditors', ['openModal']);
    mockEditors.openModal.and.returnValue(jasmine.createSpyObj('p', ['then']));
    model = new Model();
    mockHotkeys = jasmine.createSpyObj('mockHotkeys', ['add']);
    ctrl = new EditorController(mockEditors, model, mockHotkeys);
    ctrl.graph = {};
  });

  it('sets up hotkeys by default', function() {
    expect(mockHotkeys.add).toHaveBeenCalled();
  });

  describe('addOptions', function() {

    it('gets initialized', function() {
      expect(ctrl.addOptions.length).toBe(4);
    });

    it('opens modals', function() {
      ctrl.addOptions.map(function(opt) {
        opt.callback();
        expect(mockEditors.openModal)
          .toHaveBeenCalledWith(opt.type, ctrl.graph);
      });
    });
  });
});
