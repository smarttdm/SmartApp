'use strict';

angular.module('app.galleryview').controller('galleryViewCtrl', function ($scope, $rootScope, $http, $state, $stateParams, APP_CONFIG, promiseParams, promiseClassInfo, promiseItems, promisedCommands) {

    $scope.dbschema = $stateParams.schema;
    $scope.dbclass = $stateParams.class;

    if ($stateParams.pageIndex) {
        $scope.pageIndex = parseInt($stateParams.pageIndex);
    }
    else {
        $scope.pageIndex = 0;
    }

    var itemCollection = promiseItems.data;
    var commands = promisedCommands.data;
    $scope.commands = commands;
 
    var params = promiseParams.data;
    var title = params['title'];
    var desc = params['desc'];
    var smallImage = params['smallImage'];
    var fullImage = params['fullImage'];

    $scope.classInfo = promiseClassInfo.data;

    $scope.items = new Array();

    if (itemCollection) {
        for (var i = 0; i < itemCollection.length; i++) {
            var rawItem = itemCollection[i];

            var item = new Object();
            item.title = rawItem[title];
            item.description = rawItem[desc];
            item.alt = "Alt";
            if (rawItem[smallImage]) {
                item.img_thumb = "styles/custom/" + rawItem[smallImage];
            }
            else {
                item.img_thumb = "styles/img/default-thumb.jpg";
            }
            if (rawItem[fullImage]) {
                item.img_full = "styles/custom/" + rawItem[fullImage];
            }
            else {
                item.img_full = "styles/img/default-full.jpg";
            }
            item.type = rawItem.type;
            item.obj_id = rawItem.obj_id;

            $scope.items.push(item);
        }
    }

    var gotoState = function (title, dbschema, dbclass, oid) {
  
        var commands = $scope.commands;
        var url = undefined;
        var cmdUrl = undefined;
        var params = undefined;
        var cmdInfo;
        for (var cmd in commands) {
            if (commands.hasOwnProperty(cmd)) {
                cmdInfo = commands[cmd];
                if (cmdInfo.title === title) {
                    url = cmdInfo.url;
                    cmdUrl = cmdInfo.url;
                    params = new Object();
                    params.schema = dbschema;
                    params.class = dbclass;
                    params.oid = oid;
                    params.cmdHash = cmdInfo.hash;
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
            if (cmdUrl === ".modalform") {
                $state.go("app.smarttables.datagrid.modalform", params, { location: false, notify: false });
            }
            else {
                $state.go(url, params);
            }
        }
    }

    var allowWrite = true;
    var allowDelete = true;
    
    if (itemCollection &&
        itemCollection.length > 0)
    {
        allowWrite = itemCollection[0].allowWrite;
        allowDelete = itemCollection[0].allowDelete;
    }

    $scope.actions = new Array();
    var cmdInfo;
    var action;
    for (var cmd in commands) {
        if (commands.hasOwnProperty(cmd)) {
            cmdInfo = commands[cmd];
            if (cmdInfo.url === ".modalform") {
                action = new Object();
                action.label = cmdInfo.title;
                action.cssclass = "btn btn-success btn-sm";

                action.action = function (entry) {
                    gotoState(cmdInfo.title, $scope.dbschema, entry.type, entry.obj_id);
                }

                $scope.actions.push(action);
            }
        }
    }

    // add standard commands
    $scope.actions.push({
        label: $rootScope.getWord('Attachments'),
        cssclass: "btn btn-success btn-sm",
        action: function (entry) {
            $state.go('app.smarttables.datagrid.attachments', { schema: $scope.dbschema, class: entry.type, oid: entry.obj_id }, { location: false, notify: false });
        }
    });

    if (allowWrite && $stateParams.edit !== "false") {
        $scope.actions.push({
            label: $rootScope.getWord('Edit'),
            cssclass: "btn btn-success btn-sm",
            action: function (entry) {
                $state.go('app.smarttables.datagrid.modalform', { schema: $scope.dbschema, class: entry.type, oid: entry.obj_id }, { location: false, notify: false });
            }
        });
    }

    /*
    if (allowDelete && $stateParams.delete !== "false") {
        $scope.actions.push({
            label: $rootScope.getWord('Delete'),
            cssclass: "btn btn-danger btn-sm",
            action: function () {
                alert("Delete called");
            }
        });
    }
    */

    $scope.getTitle = function()
    {
        // return class title
        return $scope.classInfo.title;
    }

    $scope.reload = function (pageIndex) {
        var params = new Object();

        params.pageIndex = pageIndex;
        $scope.pageIndex = pageIndex;

        $state.go($state.current, params, { reload: true }); //second parameter is for $stateParams
    }

    $scope.prev = function () {
        var params = new Object();

        if ($scope.pageIndex > 0) {
            var pageIndex = $scope.pageIndex - 1;
            params.pageIndex = pageIndex;
            $scope.pageIndex = pageIndex;

            $state.go($state.current, params, { reload: true }); //second parameter is for $stateParams
        }
    }

    $scope.next = function () {
        var params = new Object();

        var pageIndex = $scope.pageIndex + 1;
        params.pageIndex = pageIndex;
        $scope.pageIndex = pageIndex;

        $state.go($state.current, params, { reload: true }); //second parameter is for $stateParams
    }
});