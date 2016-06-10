// @ngInject
module.exports = function ($stateProvider) {
    $stateProvider
        .state('share', {
            url: '/share',
            abstract: true
        })
        .state('share.modal', {
            url: '/modal',
            onEnter: function (share, $state) {
                share.openModal()
                    .finally(() => $state.go('home'));
            }
        })
        .state('share.load', {
            url: '/load/{data}',
            onEnter: function (share, $stateParams, $state) {
                share.restoreFromCompressed($stateParams.data);
                $state.go('home');
            }
        });
};
