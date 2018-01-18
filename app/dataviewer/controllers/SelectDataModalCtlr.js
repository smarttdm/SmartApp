'use strict';

angular.module('app.dataviewer').controller('SelectDataModalCtrl', function ($controller, $state, $scope, $rootScope, $http, $stateParams, APP_CONFIG, DataViewerService, $modalInstance) {
    $scope.dbschema = $stateParams.schema;
    $scope.dbclass = $stateParams.class;
    $scope.oid = $stateParams.oid;
    $scope.xmlschema = $stateParams.xmlschema; // schema column name
    $scope.currentCategory = $stateParams.category;
    $scope.customApi = $stateParams.api;

    $scope.xmlSchemaName = undefined;

    $scope.displayed = [];
    $scope.fields = undefined;

    $scope.isLoading = false;
    $scope.isReload = false;
    $scope.tableState;

    $scope.isSending = false;

    // indexes of selected rows
    $scope.selected = [];
    $scope.hashTable = {};

    // names of selected columns
    $scope.columnSelected = [];

    $scope.callServer = function callServer(tableState) {

        $scope.isLoading = true;
        $scope.tableState = tableState;

        var pagination = tableState.pagination;
        var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
        var number = pagination.number || 20;  // Number of entries showed per page.

        if (!$scope.xmlSchemaName) {
            DataViewerService.getXmlSchemaName($scope.dbschema, $scope.dbclass, $scope.oid, $scope.xmlschema, function (name) {
                $scope.xmlSchemaName = name;

                if ($scope.xmlSchemaName) {
                    DataViewerService.getTimeSeriesMetrciFields($scope.dbschema, $scope.dbclass, $scope.xmlSchemaName, function (fields) {
                        $scope.timeSeriesMetricFields = fields;

                        DataViewerService.getTimeSeriesMetric($scope.dbschema, $scope.dbclass, $scope.oid, $scope.xmlSchemaName, $scope.currentCategory, start, number, $scope.isReload, function (result) {
                            if (result) {
                                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update

                                $scope.displayData(result);

                                $scope.isLoading = false;
                                $scope.isReload = false;
                            }
                        })
                    })
                }
                else {
                    $scope.isLoading = false;
                    $scope.isReload = false;
                }
            })
        }
        else {
            if ($scope.xmlSchemaName) {
                DataViewerService.getTimeSeriesMetric($scope.dbschema, $scope.dbclass, $scope.oid, $scope.xmlSchemaName, $scope.currentCategory, start, number, $scope.isReload, function (result) {
                    if (result) {
                        tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update

                        $scope.displayData(result);

                        $scope.isLoading = false;
                        $scope.isReload = false;
                    }
                })
            }
        }
    };

    $scope.select = function (rowIndex) {

        var found = $scope.selected.indexOf(rowIndex);

        if (found == -1) {
            $scope.selected.push(rowIndex);

            $scope.hashTable[rowIndex] = getRowData(rowIndex);
        }
        else {
            $scope.selected.splice(found, 1);
            delete $scope.hashTable[rowIndex];
        }
    };

    function getRowData(rowIndex)
    {
        var found = undefined;

        for (var i = 0; i < $scope.displayed.length; i++)
        {
            if ($scope.displayed[i]["Index"] == rowIndex)
            {
                found = JSON.parse(JSON.stringify($scope.displayed[i]));
                break;
            }
        }

        return found;
    }

    $scope.toggleSelection = function(columName)
    {
        var found = $scope.columnSelected.indexOf(columName);

        if (found == -1)
            $scope.columnSelected.push(columName);
        else
            $scope.columnSelected.splice(found, 1);
    }

    $scope.displayData = function (result) {
        var data = result.data;

        if (data && data.length > 0) {
            var row = data[0];
            var fields = [];

            for (var key in row) {
                if (row.hasOwnProperty(key)) {
                    fields.push(key);
                }
            }

            if ($scope.columnSelected.length == 0)
            {
                // initialize the column selection
                for (var key in row) {
                    if (row.hasOwnProperty(key)) {
                        if (key != "Index") {
                            $scope.columnSelected.push(key);
                        }
                    }
                }
            }

            for (var i = 0; i < data.length; i++) {
                var found = $scope.selected.indexOf(data[i]["Index"]);

                if (found == -1)
                    data[i].isSelected = false;
                else
                    data[i].isSelected = true;
            }

            $scope.displayed = data;

            $scope.fields = fields;
        }
    };

    $scope.confirm = function () {
        if (!$scope.customApi)
            alert($rootScope.getWord("Missing Custom API"));
        else {
            if ($scope.selected.length == 0)
            {
                alert($rootScope.getWord("No rows selected"));
                return;
            }

            if ($scope.columnSelected.length == 0) {
                alert($rootScope.getWord("No columns selected"));
                return;
            }

            var selectedData = getSelectedData();

            $scope.isSending = true;
            DataViewerService.sendTestData($scope.dbschema, $scope.dbclass, $scope.oid, $scope.customApi, selectedData, function () {
                $scope.isSending = false;
                alert($rootScope.getWord("Data Sent"));
            });
        }
    }

    function getSelectedData() {
        var rows = [];
        var newRow;

        for (var i = 0; i < $scope.selected.length; i++)
        {
            var rowIndex = $scope.selected[i];
            var row = $scope.hashTable[rowIndex];

            newRow = {};

            for (var key in row) {
                if (row.hasOwnProperty(key)) {
                    var found = $scope.columnSelected.indexOf(key);

                    if (found != -1) {
                        newRow[key] = row[key];
                    }
                }
            }

            rows.push(newRow);
        }

        return {"rows": rows};
    }

    $scope.closeModal = function () {
        $modalInstance.dismiss("dismiss");
    };
});
