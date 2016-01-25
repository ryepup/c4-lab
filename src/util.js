module.exports = {
  component: component
};

function component(template, controller, bindings) {
  return function() {
    return {
      restrict: 'EA',
      template: template,
      controller: controller || function(){},
      controllerAs: 'vm',
      bindToController: true,
      scope: bindings || {}
    };
  };
}
