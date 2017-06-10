'use strict';

angular.module('app.datacatalog').controller('DataTableViewCtrl', function ($controller, $rootScope, $scope, $http, APP_CONFIG, $state, $stateParams, TestStations, $interval, CartInfo) {

    $scope.dbschema = $stateParams.schema;
    $scope.dbclass = $stateParams.class;
    $scope.view = $stateParams.view;
    $scope.tree = $stateParams.tree;
    $scope.node = $stateParams.node;
    $scope.formTemplate = $stateParams.formtemplate;

    if ($stateParams.insert && $stateParams.insert === "false") {
        $scope.add = false;
    }
    else {
        $scope.add = true;
    }

    if ($stateParams.export && $stateParams.export === "true") {
        $scope.exportData = true;
    }
    else {
        $scope.exportData = false;
    }

    if ($stateParams.import && $stateParams.import === "true") {
        $scope.importData = true;
    }
    else {
        $scope.importData = false;
    }

    if ($stateParams.attachment && $stateParams.attachment === "false") {
        $scope.attachment = false;
    }
    else {
        $scope.attachment = true;
    }

    $scope.hasDataCart = false;
    var cart = CartInfo.getCart($stateParams.schema, $stateParams.class);
    if (cart.showDataCart)
        $scope.hasDataCart = true;

    $scope.openModal = function () {
        $state.go('.modalform', { schema: $scope.dbschema, class: $scope.dbclass, template: $scope.formTemplate }, { location: false, notify: false });
    };

    angular.extend(this, $controller('dataGridBaseCtrl', { $scope: $scope, $rootScope: $rootScope, $http: $http, APP_CONFIG: APP_CONFIG }));

    $scope.GetCommands = function (rowIndex, data) {
        var items = new Array();

        var url = APP_CONFIG.ebaasRootUrl + "/api/sitemap/commands/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + data.obj_id;

        $http.get(url).success(function (commands) {

            // custom commands
            $scope.commands = commands;
            var cmdInfo;
            var item;
            for (var cmd in commands) {
                if (commands.hasOwnProperty(cmd)) {
                    cmdInfo = commands[cmd];
                    item = new Object();
                    item.text = cmdInfo.title;
                    item.css = "btn btn-primary btn-md btn-nav";
                    if (cmdInfo.icon) {
                        item.icon = cmdInfo.icon;
                    }
                    else {
                        item.icon = "fa fa-lg fa-tasks";
                    }

                    item.onItemClick = function (text) {
                        gotoState(text, $scope.dbschema, data.type, data.obj_id, !data.allowWrite)
                    }

                    items.push(item);

                    if (cmdInfo.baseUrl && !APP_CONFIG.hashedBaseUrls[cmdInfo.hash])
                    {
                        APP_CONFIG.hashedBaseUrls[cmdInfo.hash] = cmdInfo.baseUrl;
                    }
                }
            }

            // add standard commands
            if ($scope.attachment) {
                items.push({
                    text: $rootScope.getWord('Attachments'),
                    icon: "fa fa-lg fa-file-archive-o",
                    css: "btn btn-default btn-md btn-nav",
                    onItemClick: function () {
                        $state.go('.attachments', { schema: $scope.dbschema, class: data.type, oid: data.obj_id, readonly: !data.allowWrite }, { location: false, notify: false });
                    }
                });
            }

            if (data.allowWrite && $stateParams.edit !== "false") {
                items.push({
                    text: $rootScope.getWord('Edit'),
                    icon: "fa fa-lg fa-edit",
                    css: "btn btn-default btn-md btn-nav",
                    onItemClick: function () {
                        $state.go('.modalform', { schema: $scope.dbschema, class: data.type, oid: data.obj_id, template: $scope.formTemplate }, { location: false, notify: false });
                    }
                });
            }

            /*
            if (data.allowCreate && $stateParams.insert !== "false") {
                items.push({
                    text: $rootScope.getWord('Add'),
                    icon: "fa fa-lg fa-plus-square",
                    css: "btn btn-default btn-md btn-nav",
                    onItemClick: function () {
                        $state.go('.modalform', { schema: $scope.dbschema, class: data.type }, { location: false, notify: false });
                    }
                });
            }
            */

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
        });
        return items;
    }

    var gotoState = function (title, dbschema, dbclass, oid, readonly) {
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
            try
            {
                if (cmdUrl === ".modalform") {
                    $state.go(url, params, { location: false, notify: false });
                }
                else {
                    $state.go(url, params);
                }
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

    $scope.gridInstance = null;
    $scope.dataGridSettings = {
        dataSource: {
            store: $scope.customStore
        },
        columnAutoWidth: true,
        sorting: {
            mode: "multiple"
        },
        height: '750px',
        searchPanel: {
            visible: $stateParams.search && $stateParams.search === "true"? true: false,
            width: 300,
            placeholder: $rootScope.getWord("Keyword Search")
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
            showPageSizeSelector: true,
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
        },
        onRowPrepared: function (e) {
        }
    };

    $rootScope.$on('modalClosed', function (event, data) {
        if ($scope.gridInstance && data === "update")
            $scope.gridInstance.refresh();
    });

    $scope.getCartItemCount = function()
    {
        var cart = CartInfo.getCart($stateParams.schema, $stateParams.class);
        return cart.count;
    }

    $scope.openCart = function()
    {
        $state.go(".datacart", { schema: $scope.dbschema, class: $scope.dbclass }, { location: false, notify: false });
    }
});