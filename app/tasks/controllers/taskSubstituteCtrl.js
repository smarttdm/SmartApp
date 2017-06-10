"use strict";

angular.module('app.tasks').controller('taskSubstituteCtrl', function ($scope, $http, $stateParams, $modalInstance, APP_CONFIG, User) {

    $scope.substitureRule = undefined;

    $scope.rowCollection = [];

    var url = APP_CONFIG.ebaasRootUrl + "/api/tasks/substitute/" + encodeURIComponent($stateParams.schema) + "/" + User.userName;

    $http.get(url).success(function (data) {
        $scope.substitureRule = data;
        $scope.rowCollection = data.substituteEntries;
    });

    $scope.update = function ()
    {
        var url = APP_CONFIG.ebaasRootUrl + "/api/tasks/substitute/" + encodeURIComponent($stateParams.schema) + "/" + User.userName;
  
        $http.post(url, $scope.substitureRule)
            .success(function () {
                $modalInstance.close("update");
            });
    }

    $scope.closeModal = function () {
        $modalInstance.dismiss("dismiss");
    };
});