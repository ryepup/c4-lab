module.exports = {
  addProxyGetter: addProxyGetter
};

function addProxyGetter(proxy, source, sourceField, proxyField) {
  Object.defineProperty(proxy, proxyField || sourceField, {
    get: function() { return source[sourceField]; }
  });
}
