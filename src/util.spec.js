const util = require('./util'),
      exporter = require('./exporter/json');

describe('util', function() {
  describe('addProxyGetter', function() {
    let src, proxy;
    beforeEach(function() {
      src = {};
      proxy = {};
    });

    it('adds a getter', function() {
      src.test = "1";
      expect(proxy.test).not.toBeDefined();
      util.addProxyGetter(proxy, src, 'test');
      expect(proxy.test).toBe("1");
    });

    it('updates as the source changes', function() {
      src.test = "1";
      util.addProxyGetter(proxy, src, 'test');
      expect(proxy.test).toBe("1");
      src.test = "2";
      expect(proxy.test).toBe("2");
    });

    it('does not count towards exporting', function() {
      src.test = "1";
      util.addProxyGetter(proxy, src, 'test');
      const json = exporter.toJson(proxy);
      expect(json).toBe("{}");
    });

    it('can alias field names', function() {
      src.test = "1";
      util.addProxyGetter(proxy, src, 'test', 'otherName');
      expect(proxy.otherName).toBe("1");
    });
  });
});
