// @ngInject
module.exports = function ($uibModalInstance, $state, share) {
    const vm = this;

    vm.link = null;
    vm.ok = $uibModalInstance.close;

    vm.link = $state.href('share.load',
        { data: share.compressGraph() },
        { absolute: true });

};