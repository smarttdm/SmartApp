'use strict';

angular.module('app.myspace').controller('mySpaceCtrl', function ($scope, $rootScope, $http, $state, $stateParams, APP_CONFIG, User, TasksInfo, myActivityService, blogService, promiseTasks) {

    $scope.dbschema = $stateParams.schema;
    $scope.blogClass = "Blog";

    $scope.user = User;

    $scope.itemsByPage = 15;

    $scope.rowCollection = promiseTasks.data;

    $scope.numOfPages = Math.ceil(promiseTasks.data.length / $scope.itemsByPage);

    TasksInfo.tasks = promiseTasks.data;
    TasksInfo.count = promiseTasks.data.length; // other components are watching task number changes through this service
    $scope.taskCount = TasksInfo.count;

    $scope.currentActivityItems = [];

    myActivityService.getbytype("msgs", function (data) {

        $scope.currentActivityItems = data;

    });

    // Getting my blogs
    blogService.getMyBlogs("COMMON", $scope.blogClass, User.userName, function (data) {
        $scope.blogs = data;

    });

    $scope.getPosterImage = function(posterId)
    {
        return User.getUserImage(posterId);
    }

    $scope.readMsg = function (msg) {
        var url = msg.url;
        var urlparams = msg.urlparams;

        urlparams = urlparams.replace(/msg.dbschema/, "\"" + msg.dbschema + "\""); // replace msg.dbschema
        urlparams = urlparams.replace(/msg.dbclass/, "\"" + msg.dbclass + "\""); // replace msg.dbclass
        urlparams = urlparams.replace(/msg.oid/, "\"" + msg.oid + "\""); // replace msg.dbclass

        var params = JSON.parse(urlparams);

        var found = false;
        var index = undefined;

        for (var i = 0; i < $scope.currentActivityItems.length; i++) {
            var activity = $scope.currentActivityItems[i];
            if (activity.objId === msg.objId) {
                index = i;
                found = true;
                break;
            }
        }

        if (found) {

            $scope.currentActivityItems.splice(index, 1);
        }

        myActivityService.remove("msgs", msg.objId, function (data) {
            if (url) {
                $state.go(url, params);
            }
        });
    }

    $scope.RefreshTasks = function()
    {
        $http.get(APP_CONFIG.ebaasRootUrl + "/api/tasks/" + encodeURIComponent($scope.dbschema)).success(function (data) {
            $scope.rowCollection = data;

            $scope.numOfPages = Math.ceil(data.length / $scope.itemsByPage);

            TasksInfo.tasks = data;
            TasksInfo.count = data.length; // other components are watching task number changes through this service
            $scope.taskCount = TasksInfo.count;
        })
    }

    $scope.OpenSetSubstitute = function () {
        $state.go(".substitute", { schema: $scope.dbschema });
    }

    $rootScope.$on('modalClosed', function (event, data) {
        if (data === "update")
            $scope.RefreshTasks();
    });

    $scope.finishedTasks = undefined;
    $scope.numOfPagesForFinished = 0;

    $scope.showFinishedTasks = function ()
    {
        $http.get(APP_CONFIG.ebaasRootUrl + "/api/tasks/finished/user/" + encodeURIComponent($scope.dbschema)).success(function (data) {
            $scope.finishedTasks = data;

            $scope.numOfPagesForFinished = Math.ceil(data.length / $scope.itemsByPage);
        })
    }

    $scope.clearFinishedTasks = function()
    {
        $http.delete(APP_CONFIG.ebaasRootUrl + "/api/tasks/finished/" + encodeURIComponent($scope.dbschema)).success(function () {

            $scope.finishedTasks = undefined;

            $scope.numOfPagesForFinished = 0;
        })
    }
});