'use strict';

angular.module('app.wizards').controller('requestItemsCtrl', function ($controller, $rootScope, $scope, $http, APP_CONFIG, $stateParams, $state, RequestInfo) {

    $scope.dbschema = this.dbschema;
    $scope.dbclass = this.dbclass;
    $scope.oid = RequestInfo.requestId(); // get oid from RequestInfo service

    $scope.isrelated = true;
    $scope.relatedclass = RequestInfo.params['itemClass'];
    $scope.relatedview = RequestInfo.params['itemView'];
    $scope.inlineCmds = true;

    angular.extend(this, $controller('dataGridBaseCtrl', { $scope: $scope, $rootScope: $rootScope, $http: $http, APP_CONFIG: APP_CONFIG }));

    $scope.gridInstance = null;
    $scope.dataGridSettings = {
        dataSource: {
            store: $scope.customStore
        },
        columnAutoWidth: true,
        sorting: {
            mode: "none"
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
        paging: { pageSize: 50 },
        filterRow: {
            visible: false
        },
        searchPanel: { visible: false },
        selection: { mode: 'multiple' },
        remoteOperations: true,
        bindingOptions: {
            columns: 'columns'
        },
        headerFilter: {
            visible: false
        },
        rowAlternationEnabled: true,
        onInitialized: function (e) {
            $scope.gridInstance = e.component;
            RequestInfo.itemGridInstance = e.component;
        }
    };

    function arrayContains(key, keyArray) {
        return (keyArray.indexOf(key) > -1);
    }

    $scope.editItem = function (value, data) {
        // get form name for the sample class, each sample bottom class has one form name or no form defined
        var formName = undefined;

        // data.type is the bottom class name of the selected instance
        // get instance with display values
        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + data.type + "/" + value;

        $http.get(url).success(function (result) {
            // result is javascript object represents the edit instance
            if (result[RequestInfo.params['itemForm']]) {

                formName = result[RequestInfo.params['itemForm']];
            }
            $state.go('.itemform', {rclass: data.type, rtemplate: formName, roid: value });
        });
    }

    $scope.removeItem = function (value, rowIndex) {

        $scope.gridInstance.deleteRow(rowIndex);
    }

    $scope.getWord = function(key)
    {
        return $rootScope.getWord(key);
    }

    $rootScope.$on('modalClosed', function (event, data) {
        if ($scope.gridInstance && data === "itemupdate") {
            $scope.oid = RequestInfo.requestId(); // get oid from RequestInfo service
            $scope.gridInstance.refresh();
        }
    });
});
