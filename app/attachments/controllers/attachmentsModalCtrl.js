'use strict';

angular.module('app.attachments').controller('attachmentsModalCtrl', function ($scope, $stateParams, $modalInstance) {
 
    $scope.dbschema = $stateParams.schema;
    $scope.dbclass = $stateParams.class;
    $scope.oid = $stateParams.oid;
    $scope.readonly = $stateParams.readonly;
    
    $scope.closeModal = function () {
        $modalInstance.dismiss("dismiss");
    };
});
