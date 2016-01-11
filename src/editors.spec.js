var Model = require('./model'),
    Editors = require('./editors');

describe('editors', function() {
  var editors, mockUibModal;

  beforeEach(function() {
    mockUibModal = jasmine.createSpyObj('$uibModal', ['open']);
    mockUibModal.open.and
      .returnValue(jasmine.createSpyObj('modal', ['close', 'dismiss']));

    editors = new Editors(mockUibModal, new Model());
  });

  describe('openModal', function() {

  });
});
