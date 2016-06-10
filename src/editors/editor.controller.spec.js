const EditorController = require('./editor.controller')
;

describe('editor.controller', function() {
  let ctrl, mockHotkeys, mockState;
  beforeEach(function() {
    mockState = jasmine.createSpyObj('$state', ['is', 'go']);
    mockState.params = {};
    mockHotkeys = jasmine.createSpyObj('mockHotkeys', ['add']);
    ctrl = new EditorController(mockHotkeys, mockState);
    ctrl.graph = {};
  });

  it('sets up hotkeys by default', function() {
    expect(mockHotkeys.add).toHaveBeenCalled();
  });

  describe('addOptions', function() {

    it('gets initialized', function() {
      expect(ctrl.addOptions.length).toBe(4);
    });

    it('changes url when selected', function() {
      ctrl.addOptions.map(function(opt) {
        opt.callback();
        expect(mockState.go)
          .toHaveBeenCalledWith('add', {type: opt.type, id: undefined});
      });
    });
  });
});
