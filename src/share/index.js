const angular = require('angular'),
      moduleName = 'c4-lab.share'
;

angular.module(moduleName, ['ui.bootstrap', 'ui.router'])
    .service('share', require('./share.service'))
    .config(require('./routes'))
;

module.exports = moduleName