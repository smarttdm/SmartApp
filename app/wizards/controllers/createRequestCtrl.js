"use strict";

angular.module('app.wizards').controller('createRequestCtrl', function ($scope, $state, $http, $stateParams, $modalInstance, APP_CONFIG, CartInfo, dataCartService) {

    $scope.dbschema = $stateParams.schema;
    $scope.dbclass = $stateParams.class;
    $scope.oid = $stateParams.oid;
    $scope.sourcetemplate = $stateParams.sourcetemplate;
    $scope.orderclass = $stateParams.orderclass;
    $scope.targettemplate = $stateParams.targettemplate;
    $scope.orderid = undefined;
    $scope.wizardhash = $stateParams.wizardhash;
    $scope.api = $stateParams.api;
    $scope.loading = false;
    
    $scope.model = {};

    $scope.createRequest = function () {

        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.orderclass + "/new?formformat=false";

        $http.get(url)
            .success(function (data) {
                $scope.loading = true;
                $scope.model = data;

                // call custom API to create a test order from the test requirement
                url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.orderclass + "/custom/" + $scope.api + "?source=" + $scope.dbclass + "&sourceid=" + $scope.oid + "&sourcetemplate=" + $scope.sourcetemplate + "&targettemplate=" + $scope.targettemplate;

                //console.log($scope.model);
                $http.post(url, $scope.model)
                    .success(function (data) {
                        if (data.obj_id) {
                            // get oid from the newly created instance
                            $scope.orderid = data.obj_id;
                        }
                        $scope.loading = false;
                        $state.go('app.smarttables.datagrid.requestwizard', { schema: $scope.dbschema, class: $scope.orderclass, oid: $scope.orderid, hash: $scope.wizardhash });
                    });
        });
    };

    $scope.closeModal = function () {
        $modalInstance.dismiss("dismiss");
    };
});