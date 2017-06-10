'use strict';

angular.module('app.dataviewer').controller('TimeSeriesModalCtrl', function ($controller, $scope, $rootScope, $http, $stateParams, APP_CONFIG, $modalInstance, DataViewerService, FlotConfig) {

    $scope.frequency = $stateParams.frequency;
    $scope.ts = $stateParams.ts;
    $scope.isLoading = false;

    //localStorage.clear();
    $scope.rowCollection = [];

    if (localStorage.getItem("time-series-set")) {
        var savedRows = localStorage.getItem("time-series-set");
        if (savedRows.length > 0) {
            var rows = JSON.parse(savedRows);
            $scope.rowCollection = rows;
        }
    }

    var row = {};
    row.id = "ts" + $scope.rowCollection.length;
    row.frequency = $scope.frequency;
    row.data = $scope.ts;
    row.isSelected = true; // select the new row

    for (var i = 0; i < $scope.rowCollection.length; i++)
    {
        $scope.rowCollection[i].isSelected = false;
    }

    $scope.rowCollection.push(row);

    $scope.checkFileAPI = function() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            // Great success! All the File APIs are supported.
        } else {
            alert('The File APIs are not fully supported in this browser.');
        }
    }

    $scope.handleSelectedFile = function(file)
    {
        var reader = new FileReader();

        if (file) {
            reader.readAsText(file);
        }
        
        reader.onloadend = function (e) {
            if (reader.result) {
                var lines = reader.result.split("\n");

                var rowCollection = getRowCollection(lines);
                var count = rowCollection.length;
                // append the current time series to the collection
                for (var i = 0; i < $scope.rowCollection.length; i++)
                {
                    $scope.rowCollection[i].id = "ts" + count;
                    rowCollection.push($scope.rowCollection[i]);
                    count++;
                }

                $scope.rowCollection = rowCollection;
            }
        }
    }

    function getRowCollection(lines)
    {
        var rows = [];
        var row;
        for (var i = 0; i < lines.length; i++)
        {
            if (lines[i].length > 0) {
                row = {};
                var items = lines[i].split(";");
                var index;
                if (items.length > 2) {
                    row.id = items[0];
                    row.frequency = items[1];
                    index = lines[i].indexOf(row.frequency) + row.frequency.length + 1;
                    row.data = lines[i].substring(index); // rest is data

                    rows.push(row);
                }
            }
        }

        return rows;
    }

    $scope.deleteRows = function()
    {
        var i = $scope.rowCollection.length;
        while (i--) {
            if ($scope.rowCollection[i].isSelected) {
                $scope.rowCollection.splice(i, 1);
            }
        }
    }

    $scope.clearRows = function()
    {
        var result = confirm($rootScope.getWord("Confirm Clear All"));
        if (result) {
            $scope.rowCollection = [];
        }
    }

    $scope.downloadFile = function()
    {
        $scope.isLoading = true;
        var filename = "ts.txt";
        var processRow = function (row) {
            var finalVal = '';
            var j = 0;
            for (var key in row) {
                if (row.hasOwnProperty(key) && key != "isSelected") {
                    var innerValue = row[key] === null ? '' : row[key].toString();
                    var result = innerValue.replace(/"/g, '""');
                    if (result.search(/("|,|\n)/g) >= 0)
                        result = '"' + result + '"';
                    if (j > 0)
                        finalVal += ';';
                    finalVal += result;
                    j++;
                }
            }
            return finalVal + '\r\n';
        };

        var content = '';
       
        for (var i= 0; i < $scope.rowCollection.length; i++) {
            content += processRow($scope.rowCollection[i]);
        }

        var blob = new Blob([content], { type: 'plain/text;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }

        $scope.isLoading = false;
    }

    $scope.closeModal = function () {
        if ($scope.rowCollection.length > 0) {
            localStorage.setItem('time-series-set', JSON.stringify($scope.rowCollection));
        }
        else
        {
            localStorage.setItem('time-series-set', "");
        }
        $modalInstance.dismiss("dismiss");
    };

});

angular.module('app.dataviewer').directive('filelistBind', function () {
    return function (scope, elm, attrs) {
        elm.bind('change', function (evt) {
            scope.$apply(function () {
                scope.handleSelectedFile(evt.target.files[0]);
            });
        });
    };
});
