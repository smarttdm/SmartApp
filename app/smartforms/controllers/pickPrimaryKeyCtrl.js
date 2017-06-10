'use strict';

angular.module('app.smartforms').controller('pickPrimaryKeyCtrl', function ($scope, $controller, $rootScope, $http, APP_CONFIG, $stateParams, $modalInstance) {
    $scope.dbschema = $stateParams.schema;
    $scope.dbclass = $stateParams.pkclass;
    $scope.property = $stateParams.property;
    $scope.filter = unescape($stateParams.filter);
    $scope.callback = $stateParams.callback;

    angular.extend(this, $controller('dataGridBaseCtrl', { $scope: $scope, $rootScope: $rootScope, $http: $http, APP_CONFIG: APP_CONFIG}));

    $scope.gridInstance = null;
    $scope.dataGridSettings = {
        dataSource: {
            store: $scope.customStore
        },
        columnAutoWidth: true,
        sorting: {
            mode: "multiple"
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
        searchPanel: { visible: true },
        selection: { mode: 'single' },
        remoteOperations: true,
        bindingOptions: {
            columns: 'columns'
        },
        headerFilter: {
            visible: true
        },
        rowAlternationEnabled: true,
        onInitialized: function (e) {
            $scope.gridInstance = e.component;
        },
        onRowClick: function (e) {
            if (e.rowType == "data")
            {
                var url = APP_CONFIG.ebaasRootUrl + "/api/form/primarykey/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + encodeURIComponent(e.key);

                $http.get(url).success(function (data) {
                    // data is primary key value(s). If primary key consists of more than one property, primary key values are separated by &
                    $modalInstance.close({"modal": "pickPrimaryKey", "property" : $scope.property, "value" : data, "callback": $scope.callback});
                });
            }
        }
    };

    function unescape(str)
    {
        return str.replace(/%/g, "'");
    }
});
