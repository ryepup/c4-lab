module.exports = {
  component: component,
  addProxyGetter: addProxyGetter
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

function addProxyGetter(proxy, source, sourceField, proxyField) {
  Object.defineProperty(proxy, proxyField || sourceField, {
    get: function() { return source[sourceField]; }
  });
}
