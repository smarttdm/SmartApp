"use strict";

angular.module('app.myspace').controller('finishedTaskFormCtrl', function ($controller, $rootScope, $scope, $http, APP_CONFIG, $stateParams, $state, promiseFinishedTaskInfo) {

    console.log(promiseFinishedTaskInfo.data);

    if (!promiseFinishedTaskInfo.data) {

        BootstrapDialog.show({
            title: $rootScope.getWord("Info Dialog"),
            type: BootstrapDialog.TYPE_INFO,
            message: $rootScope.getWord("Non-exist task"),
            buttons: [{
                label: $rootScope.getWord("Cancel"),
                action: function (dialog) {
                    dialog.close();
                }
            }]
        });

        return;
    }
    if (promiseFinishedTaskInfo.data.formUrl)
    {
        if (promiseFinishedTaskInfo.data.formParams) {
            // task with custom module, goto the custom module
            var params = JSON.parse(promiseFinishedTaskInfo.data.formParams);
            params["schema"] = $stateParams.schema;
            params["class"] = promiseFinishedTaskInfo.data.bindingClassName;
            params["oid"] = promiseFinishedTaskInfo.data.bindingInstanceId;
            params["taskid"] = $stateParams.taskid;

            $state.go(promiseFinishedTaskInfo.data.formUrl, params);
        }
    }

    $scope.taskId = $stateParams.taskid;

    $scope.dbschema = $stateParams.schema;

    $scope.dbclass = promiseFinishedTaskInfo.data.bindingClassName;

    $scope.oid = promiseFinishedTaskInfo.data.bindingInstanceId; // id of the instance bound to the task

    $scope.loading = false;

    $scope.showCommands = false;

    $scope.ToolTip = "command";

    if (promiseFinishedTaskInfo.data.formParams) {
        var params = JSON.parse(promiseFinishedTaskInfo.data.formParams);

        $scope.template = params["template"];
        $scope.formAttribute = params["formAttribute"];
        if (params["showCommands"]) {
            $scope.showCommands = params["showCommands"];
        }
    }
    else {
        $scope.template = undefined;
        $scope.formAttribute = undefined;
    }

    angular.extend(this, $controller('ebaasFormBaseCtrl', { $rootScope: $rootScope, $scope: $scope, $http: $http, APP_CONFIG: APP_CONFIG }));

    $scope.goBack = function()
    {
        history.back(1);
    }
});
