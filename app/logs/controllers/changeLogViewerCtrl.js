'use strict';

angular.module('app.logs').controller('changeLogViewerCtrl', function ($scope, $rootScope, APP_CONFIG, $stateParams, $modalInstance) {

    $scope.dbschema = $stateParams.logschema;
    $scope.dbclass = $stateParams.logclass;
    $scope.oid = $stateParams.logoid;
    $scope.property = $stateParams.logproperty;


    $scope.closeModal = function () {
        $modalInstance.dismiss("dismiss");
    };
});
