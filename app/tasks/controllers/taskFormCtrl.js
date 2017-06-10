"use strict";

angular.module('app.tasks').controller('taskFormCtrl', function ($controller, $rootScope, $scope, $http, APP_CONFIG, $stateParams, $state, promiseTaskInfo) {

    if (!promiseTaskInfo.data) {

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
    if (promiseTaskInfo.data.formUrl)
    {
        if (promiseTaskInfo.data.formParams) {
            // task with custom module, goto the custom module
            var params = JSON.parse(promiseTaskInfo.data.formParams);
            params["schema"] = $stateParams.schema;
            params["class"] = promiseTaskInfo.data.bindingClassName;
            params["oid"] = promiseTaskInfo.data.bindingInstanceId;
            params["taskid"] = $stateParams.taskid;

            $state.go(promiseTaskInfo.data.formUrl, params);
        }
    }

    $scope.taskId = $stateParams.taskid;

    $scope.dbschema = $stateParams.schema;

    $scope.dbclass = promiseTaskInfo.data.bindingClassName;

    $scope.oid = promiseTaskInfo.data.bindingInstanceId; // id of the instance bound to the task

    $scope.loading = false;

    $scope.showCommands = false;

    $scope.ToolTip = "command";

    if (promiseTaskInfo.data.formParams) {
        var params = JSON.parse(promiseTaskInfo.data.formParams);

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

    $scope.customActions = promiseTaskInfo.data.customActions;

    $scope.GetCustomCommands = function () {
        var items = new Array();

        var url = APP_CONFIG.ebaasRootUrl + "/api/sitemap/commands/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + $scope.oid;

        $http.get(url).success(function (commands) {

            // custom commands
            $scope.commands = commands;
            var cmdInfo;
            var item;
            for (var cmd in commands) {
                if (commands.hasOwnProperty(cmd)) {
                    cmdInfo = commands[cmd];
                    item = new Object();
                    item.title = cmdInfo.title;
                    if (cmdInfo.icon) {
                        item.icon = cmdInfo.icon;
                    }
                    else {
                        item.icon = "fa fa-lg fa-tasks";
                    }

                    items.push(item);

                    if (cmdInfo.baseUrl && !APP_CONFIG.hashedBaseUrls[cmdInfo.hash]) {
                        APP_CONFIG.hashedBaseUrls[cmdInfo.hash] = cmdInfo.baseUrl;
                    }
                }
            }
        });

        return items;
    }

    angular.extend(this, $controller('ebaasFormBaseCtrl', { $rootScope: $rootScope, $scope: $scope, $http: $http, APP_CONFIG: APP_CONFIG }));

    $scope.goBack = function()
    {
        $state.go("app.tasks.list");
    }

    $scope.runAction = function (actionId)
    {
        $scope.actionId = actionId; // inform the server to run the script of the workflow action on the submitted instance

        $scope.customAction = findAction(actionId);

        $scope.submitForm($scope.submitFormCallback);
    }

    $scope.submitFormCallback = function (data) {
        // if instance is undefined, then there are errors in the form submit
        if (data.instance &&
            $scope.customAction)
        {
            if ($scope.customAction.formAction === "SubmitAndClose") {
                $state.go("app.tasks.list", {}, { reload: true });
            }
            else
            {
                $state.go($state.current, $stateParams, { reload: true });
            }
        }
    };

    $scope.onItemClick = function(cmdTitle)
    {
        var commands = $scope.commands;
        var url = undefined;
        var params = undefined;
        var cmdInfo;
        for (var cmd in commands) {
            if (commands.hasOwnProperty(cmd)) {
                cmdInfo = commands[cmd];
                if (cmdInfo.title === cmdTitle) {
                    url = cmdInfo.url;
                    params = new Object();
                    params.schema = $scope.dbschema;
                    params.class = $scope.dbclass;
                    params.oid = $scope.oid;
                    // add command's parameters to the state parameters
                    if (cmdInfo.parameters) {
                        for (var key in cmdInfo.parameters) {
                            if (cmdInfo.parameters.hasOwnProperty(key)) {
                                params[key] = cmdInfo.parameters[key];
                            }
                        }
                    };

                    break;
                }
            }
        }

        if (url) {
            try
            {
                $state.go(url, params);
            }
            catch (err)
            {
                BootstrapDialog.show({
                    title: $rootScope.getWord("Info Dialog"),
                    type: BootstrapDialog.TYPE_INFO,
                    message: $rootScope.getWord("Invalid Command"),
                    buttons: [{
                        label: $rootScope.getWord("Cancel"),
                        action: function (dialog) {
                            dialog.close();
                        }
                    }]
                });
            }
        }
    }

    var findAction = function(actionId)
    {
        var action = undefined;

        for (var i = 0; i < $scope.customActions.length; i++)
        {
            if ($scope.customActions[i].id  == actionId)
            {
                action = $scope.customActions[i];
                break;
            }
        }

        return action;
    }
});
