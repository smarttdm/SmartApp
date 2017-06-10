'use strict';

angular.module('app.bulletinboard').controller('bulletinViewCtrl', function ($scope, $state, $http, $stateParams, APP_CONFIG, bulletinService) {
    $scope.dbschema = $stateParams.schema;
    $scope.dbclass = $stateParams.class;
    $scope.oid = $stateParams.oid;

    if ($scope.oid) {
        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + $scope.oid;

        $http.get(url).success(function (data) {
            $scope.post = data;
        }).error(function () {
            
            $scope.post = {};
        });
    }
    else
    {
        $scope.post = {};
    }
});