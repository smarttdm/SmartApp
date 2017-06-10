'use strict';

angular.module('app.smarttables').controller('relatedDataGridCtrl', function ($scope, $controller, $rootScope, $http, APP_CONFIG, $stateParams, $state, promiseParentClassInfo) {
   
    $scope.dbschema = $stateParams.schema;
    $scope.dbclass = $stateParams.class;
    $scope.oid = $stateParams.oid;
    $scope.isrelated = true;
    $scope.relatedclass = $stateParams.relatedclass;

    if ($stateParams.exportrelated && $stateParams.exportrelated === "true") {
        $scope.exportData = true;
    }
    else {
        $scope.exportData = false;
    }

    if ($stateParams.importrelated && $stateParams.importrelated === "true") {
        $scope.importData = true;
    }
    else {
        $scope.importData = false;
    }

    $scope.parentClassInfo = promiseParentClassInfo.data;

    angular.extend(this, $controller('dataGridBaseCtrl', { $scope: $scope, $rootScope: $rootScope, $http: $http, APP_CONFIG: APP_CONFIG}));

    $scope.openModal = function () {
        $state.go('.relatedform', { schema: $scope.dbschema, rclass: $scope.relatedclass}, { location: false, notify: false });
    };

    $scope.GetCommands = function (rowIndex, data)
    {
        var items = [];

        // add standard commands
        // add standard commands
        items.push({
            text: $rootScope.getWord('Attachments'),
            icon: "fa fa-lg fa-file-archive-o",
            css: "btn btn-default btn-md btn-nav",
            onItemClick: function () {
                $state.go('.attachments', { schema: $scope.dbschema, class: data.type, oid: data.obj_id, readonly: !data.allowWrite}, { location: false, notify: false });
            }
        });

        if (data.allowWrite && $stateParams.edit !== "false") {
            items.push({
                text: $rootScope.getWord('Edit'),
                icon: "fa fa-lg fa-edit",
                css: "btn btn-default btn-md btn-nav",
                onItemClick: function () {
                    $state.go('.relatedform', { schema: $scope.dbschema, rclass: data.type, roid: data.obj_id }, { location: false, notify: false });
                }
            });
        }

        if (data.allowDelete && $stateParams.delete !== "false") {
            items.push({
                text: $rootScope.getWord('Delete'),
                icon: "fa fa-lg fa-times",
                css: "btn btn-default btn-md btn-nav",
                onItemClick: function () {
                    $scope.gridInstance.deleteRow(rowIndex);
                }
            });
        }
        
        return items;
    }

    var gotoState = function (title, dbschema, dbclass, oid, readonly)
    {
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
                    params.readonly = readonly;
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
                $state.go(url, params, { location: false, notify: false });
            }
            else {
                $state.go(url, params);
            }
        }
    }

    $scope.gridInstance = null;
    $scope.dataGridSettings = {
        dataSource: {
            store: $scope.customStore
        },
        columnAutoWidth: true,
        height: '750px',
        sorting: {
            mode: "multiple"
        },
        searchPanel: {
            visible: false,
            highlightSearchText: false
        },
        editing: {
            allowAdding: false,
            allowUpdating: false,
            allowDeleting: false
        },
        grouping: {
            autoExpandAll: false
        },
        pager: {
            visible: true,
            showPageSizeSelector: false,
            showInfo: true
        },
        filterRow: {
            visible: true,
            applyFilter: "auto"
        },
        selection: { mode: 'single' },
        remoteOperations: true,
        bindingOptions: {
            columns: 'columns'
        },
        headerFilter: {
            visible: true
        },
        rowAlternationEnabled: true,
        masterDetail: {
            enabled: true,
            template: "detail"
        },
        onRowClick: function (e) {
            if (e.rowType === "data") {
                var isExpanded = $scope.gridInstance.isRowExpanded(e.key);
                $scope.gridInstance.collapseAll(-1); // collaspsed all
                if (!isExpanded) {
                    $scope.gridInstance.expandRow(e.key);
                }
            }
        },
        onInitialized: function (e) {
            $scope.gridInstance = e.component;
        }
    };

    $scope.parentClassTitle = function () {
        // return class title
        return $scope.parentClassInfo.title;
    }

    $scope.goBack = function () {
        history.back(1);
    }

    $rootScope.$on('modalClosed', function (event, data) {
        if ($scope.gridInstance && data === "update")
            $scope.gridInstance.refresh();
    });
});