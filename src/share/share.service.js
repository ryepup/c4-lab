const lz = require('lz-string');

// @ngInject
module.exports = function (model, exporter, $uibModal) {
    const self = this;

    self.restoreFromCompressed = function (uriData) {
        const json = lz.decompressFromEncodedURIComponent(uriData),
            graph = exporter.fromJson(json);

        model.load(graph);
    };

    self.compressGraph = function () {
        const json = exporter.toJson(model.currentGraph);
        return lz.compressToEncodedURIComponent(json);
    };

    self.openModal = function () {
        return $uibModal.open({
            template: require('./share-modal.html'),
            controller: require('./share-modal.controller'),
            controllerAs: 'vm',
            bindToController: true
        }).result;
    };
}