/// <reference path='./DlhSoft.Kanban.Angular.Components.ts'/>
var KanbanBoard = DlhSoft.Controls.KanbanBoard;


var nextIteration = { groups: [], items: [] };
angular.module('app.taskkanban').controller('KanbanMainCtrl', function ($http, $scope, $rootScope, APP_CONFIG, $stateParams, $state, kanbanModel, hubService) {
    // Bind data to the user interface.
    $scope.dbschema = $stateParams.schema;
    $scope.kanban = $stateParams.kanban;

    if ($stateParams.keywords)
    {
        $scope.keywords = $stateParams.keywords;
    }
    else
    {
        $scope.keywords = "";
    }

    if ($stateParams.pageIndex) {
        $scope.pageIndex = parseInt($stateParams.pageIndex);
    }
    else
    {
        $scope.pageIndex = 0;
    }

    if ($stateParams.objid) {
        $scope.objid = $stateParams.objid;
    }
    else {
        $scope.objid = "";
    }

    $scope.kanbanText = kanbanModel.data.text; // display text

    $scope.states = kanbanModel.data.states;

    $scope.groups = kanbanModel.data.groups;

    $scope.items = kanbanModel.data.items;

    $scope.groupCommands = kanbanModel.data.groupCommands;

    $scope.itemCommands = kanbanModel.data.itemCommands;

    //console.debug("kanban model = " + JSON.stringify(kanbanModel.data));

    $scope.reload = function(pageIndex)
    {
        var params = new Object();
       
        params.keywords = $scope.keywords;
        params.pageIndex = pageIndex;
        params.objid = $scope.objid;
        $scope.pageIndex = pageIndex;

        $state.go($state.current, params, { reload: true }); //second parameter is for $stateParams
    }

    $scope.prev = function () {
        var params = new Object();

        params.keywords = $scope.keywords;
        if ($scope.pageIndex > 0)
        {
            var pageIndex = $scope.pageIndex - 1;
            params.pageIndex = pageIndex;
            $scope.pageIndex = pageIndex;

            $state.go($state.current, params, { reload: true }); //second parameter is for $stateParams
        }
    }

    $scope.next = function () {
        var params = new Object();

        params.filters = $scope.keywords;

        var pageIndex = $scope.pageIndex + 1;
        params.pageIndex = pageIndex;
        $scope.pageIndex = pageIndex;

        $state.go($state.current, params, { reload: true }); //second parameter is for $stateParams
    }

    $scope.trackStatusChanged = function (group)
    {
        var groupName = $scope.dbschema + "-" + group.className + "-" + group.objId;
        hubService.removeFromGroup(groupName, function () {
            // refresh
            $scope.reload($scope.pageIndex);
        }); // hubService removes the current user from the group
    }

    // Get title of a command
    $scope.getItemCmdTitle = function (name)
    {
        var found = undefined;
  
        if ($scope.itemCommands) {
            for (var i = 0; i < $scope.itemCommands.length; i++) {
                if ($scope.itemCommands[i].id === name) {
                    found = $scope.itemCommands[i];
                    break;
                }
            }
        }

        if (found)
        {
            return found.title;
        }
        else
        {
            return "unknown";
        }
    }

    // Get icon of a command
    $scope.getItemCmdIcon = function (name)
    {
        var found = undefined;
        if ($scope.itemCommands) {
            for (var i = 0; i < $scope.itemCommands.length; i++) {
                if ($scope.itemCommands[i].id === name) {
                    found = $scope.itemCommands[i];
                    break;
                }
            }
        }

        if (found && found.icon) {

            return found.icon;
        }
        else {
            return "fa fa-fw fa-question-circle";
        }
    }

    // On cmd click
    $scope.onItemCmdClick = function (name, item) {
        var found = undefined;
        for (var i = 0; i < $scope.itemCommands.length; i++) {
            if ($scope.itemCommands[i].id === name) {
                found = $scope.itemCommands[i];
                break;
            }
        }
        if (found) {
            try
            {
                gotoState(found, $scope.dbschema, item.className, item.objId, !item.allowWrite);
            }
            catch(err)
            {
                console.log(err);
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

    // Get title of a command
    $scope.getGroupCmdTitle = function (name) {
        var found = undefined;

        for (var i = 0; i < $scope.groupCommands.length; i++) {
            if ($scope.groupCommands[i].id === name) {
                found = $scope.groupCommands[i];
                break;
            }
        }
        if (found) {
            return found.title;
        }
        else {
            return "unknown";
        }
    }

    // Get icon of a command
    $scope.getGroupCmdIcon = function (name) {
        var found = undefined;
        for (var i = 0; i < $scope.groupCommands.length; i++) {
            if ($scope.groupCommands[i].id === name) {
                found = $scope.groupCommands[i];
                break;
            }
        }
        if (found && found.icon) {

            return found.icon;
        }
        else {
            return "fa fa-fw fa-question-circle";
        }
    }

    // On cmd click
    $scope.onGroupCmdClick = function (name, group) {
        var found = undefined;
        for (var i = 0; i < $scope.groupCommands.length; i++) {
            if ($scope.groupCommands[i].id === name) {
                found = $scope.groupCommands[i];
                break;
            }
        }
        if (found) {
            try{
                gotoState(found, $scope.dbschema, group.className, group.objId);
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

    var gotoState = function (cmd, dbschema, dbclass, oid, readonly) {
        var url = cmd.url;
        var params = new Object();
        params.schema = dbschema;
        params.class = dbclass;
        params.oid = oid;
        params.readonly = readonly;
        // add command's parameters to the state parameters
        if (cmd.parameters) {
            for (var i = 0; i < cmd.parameters.length; i++) {
                var parameter = cmd.parameters[i];
                params[parameter.name] = parameter.value;
            }
        };

        if (cmd.url === ".modalform") {
            $state.go(url, params, { location: false, notify: false });
        }
        else
        {
            $state.go(url, params);
        }
    }

    // Initialize a newly created item before adding it to the user interface.
    $scope.initializeNewItem = function (item) {
        item.assignedResource = resource1;
        //console.log('A new item was created.');
    };
    // Allow item deletion by clicking a button in the user interface.
    $scope.deleteItem = function (item) {
        items.splice(items.indexOf(item), 1);
        //console.log('Item ' + item.name + ' was deleted.');
    };
    // Handle changes.
    $scope.onItemStateChanged = function (item, state) {
        //console.log('State of ' + item.name + ' was changed to: ' + state.name);
    };
    $scope.onItemGroupChanged = function (item, group) {
        //console.log('Group of ' + item.name + ' was changed to: ' + group.name);
    };
    // Move items to the next iteration.
    $scope.nextIteration = nextIteration;
    $scope.moveItemToNextIteration = function (type, index) {
        if (type === DlhSoft.Controls.KanbanBoard.types.group) {
            // Move an entire group (story) and all its items.
            var group = groups[index];
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.group === group) {
                    items.splice(i--, 1);
                    nextIteration.items.push(item);
                }
            }
            groups.splice(index, 1);
            if (nextIteration.groups.indexOf(group) < 0)
                nextIteration.groups.push(group);
            console.log('Group ' + group.name + ' and its items were moved to next iteration.');
        }
        else {
            // Move a single item, and copy the group (story) if needed.
            var item = items[index];
            items.splice(index, 1);
            nextIteration.items.push(item);
            var group = item.group;
            if (nextIteration.groups.indexOf(group) < 0)
                nextIteration.groups.push(group);
            console.log('Item ' + item.name + ' was moved to next iteration.');
        }
    };
});
//# sourceMappingURL=app.js.map