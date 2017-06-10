'use strict';

angular.module('app.wizards').controller('requestSamplesCtrl', function ($controller, $rootScope, $scope, $http, APP_CONFIG, $stateParams, $state, RequestInfo) {

    $scope.dbschema = this.dbschema;
    $scope.dbclass = this.dbclass;
    $scope.oid = RequestInfo.requestId(); // get oid from RequestInfo service

    $scope.isrelated = true;
    $scope.relatedclass = RequestInfo.params['sampleClass'];
    $scope.relatedview = RequestInfo.params['sampleView'];
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
        paging: { pageSize: 50},
        filterRow: {
            visible: false
        },
        searchPanel: { visible: false },
        selection: { mode: 'single' },
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
            RequestInfo.sampleGridInstance = e.component;
        },
        onRowClick: function (e) {
            if (e.rowType == "data") {
                if (RequestInfo.selectdSampleKey)
                {
                    // remember the item selections for the previous selected sample by clone the array
                    RequestInfo.sampleItemsMap[RequestInfo.selectdSampleKey] = RequestInfo.itemGridInstance.getSelectedRowKeys().slice(0);
                }

                // set the key of the selected row as current sample key
                RequestInfo.selectdSampleKey = e.key;
                // clear the item selections
                RequestInfo.itemGridInstance.clearSelection();
                
                if (RequestInfo.sampleItemsMap[e.key] && RequestInfo.sampleItemsMap[e.key].length > 0)
                {
                    // display the item selections
                    RequestInfo.itemGridInstance.selectRows(RequestInfo.sampleItemsMap[e.key]);
                }
            }
        }
    };

    $scope.editItem = function(value, data)
    {
        // get form name for the sample class, each sample bottom class has one form name or no form defined
        var formName = undefined;

        // data.type is the bottom class name of the selected instance
        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + RequestInfo.params['sampleCategoryClass'] + "?filter=['" + RequestInfo.params['sampleBottomClass'] + "', '=','" + data.type + "']";

        $http.get(url).success(function (result) {
            if (result.length > 0 && result[0][RequestInfo.params['sampleCategoryForm']])
            {
                formName = result[0][RequestInfo.params['sampleCategoryForm']];
            }

            $state.go('.sampleform', {rclass: data.type, rtemplate: formName, roid: value });
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
        if ($scope.gridInstance && data === "sampleupdate") {
            $scope.oid = RequestInfo.requestId(); // get oid from RequestInfo service
            $scope.gridInstance.refresh();
        }
    });
});
