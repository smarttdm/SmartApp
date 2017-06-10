"use strict";

angular.module('app.layout').controller('helpViewerCtlr', function ($rootScope, $scope, $stateParams, $http, APP_CONFIG) {

    $scope.hash = undefined;
    $scope.helpDoc = undefined;
    if ($stateParams.hash) {
        $scope.hash = $stateParams.hash;
    }

    if ($scope.hash) {
        if (!$scope.helpDoc) {
            $http.get(APP_CONFIG.ebaasRootUrl + "/api/sitemap/help/" + $scope.hash)
             .success(function (helpDoc) {
                 $scope.helpDoc = helpDoc;

                 $scope.pdfUrl = "helps/" + $scope.helpDoc;
             });
        }
        else
        {

            $scope.pdfUrl = "helps/" + $scope.helpDoc;
        }
    }
});
