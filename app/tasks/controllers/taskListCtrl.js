"use strict";

angular.module('app.tasks').controller('taskListCtrl', function ($scope, $rootScope, $state, $http, APP_CONFIG, promiseTasks, TasksInfo) {

    $scope.itemsByPage = 15;

    $scope.rowCollection = promiseTasks.data;

    $scope.numOfPages = Math.ceil(promiseTasks.data.length / $scope.itemsByPage);

    TasksInfo.tasks = promiseTasks.data;
    TasksInfo.count = promiseTasks.data.length; // other components are watching task number changes through this service

    $scope.getDBSchema = function()
    {
        return APP_CONFIG.dbschema;
    }

    $scope.RefreshTasks = function () {
        $http.get(APP_CONFIG.ebaasRootUrl + "/api/tasks/" + encodeURIComponent(APP_CONFIG.dbschema)).success(function (data) {
            $scope.rowCollection = data;

            $scope.numOfPages = Math.ceil(data.length / $scope.itemsByPage);

            TasksInfo.tasks = data;
            TasksInfo.count = data.length; // other components are watching task number changes through this service
            $scope.taskCount = TasksInfo.count;
        })
    }

    $scope.OpenSetSubstitute = function()
    {
        $state.go(".substitute", { schema: APP_CONFIG.dbschema });
    }

    $rootScope.$on('modalClosed', function (event, data) {
        if (data === "update")
            $scope.RefreshTasks();
    });
});