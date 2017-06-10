"use strict";

angular.module('app.tasks').controller('reassignTaskCtrl', function ($scope, $http, $stateParams, $modalInstance, APP_CONFIG, User) {

    $scope.selectedUser = undefined;

    var url = APP_CONFIG.ebaasRootUrl + "/api/accounts/users";

    $http.get(url).success(function (data) {

        $scope.userInfos = data;
    });

    $scope.assignTask = function()
    {
        if ($scope.selectedUser) {
            $http.get(APP_CONFIG.ebaasRootUrl + "/api/tasks/reassign/" + encodeURIComponent($stateParams.schema) + "/" + $stateParams.taskid + "/" + User.userName + "/" + $scope.selectedUser)
                .success(function () {
                    $scope.selectedUser = undefined;
                    $modalInstance.close("update");
            });
        }
    }

    $scope.closeModal = function () {
        $modalInstance.dismiss("dismiss");
    };
});