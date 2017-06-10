'use strict';

angular.module('app.dataviewer').controller('DataViewerBaseCtrl', function ($controller, $state, $scope, $rootScope, $http, $stateParams, APP_CONFIG, DataViewerService, FlotConfig) {

    $scope.dbschema = $stateParams.schema;
    $scope.dbclass = $stateParams.class;
    $scope.oid = $stateParams.oid;
    $scope.xmlschema = $stateParams.xmlschema; // schema column name
    $scope.formAttribute = $stateParams.formAttribute;

    $scope.xmlSchemaName = undefined;

    $scope.displayed = [];
    $scope.currentField;
    $scope.fields = undefined;
    $scope.nonIndexFields = undefined;

    $scope.currentFrequency = "Second";
    $scope.frequencies = DataViewerService.getFrequencyArray();

    $scope.currentOperation = "Mean";
    $scope.operations = DataViewerService.getOperationArray();

    $scope.currentModelId = undefined;
    $scope.maxForecasts = [];

    $scope.lineChartData = [];
    $scope.isZoomIn = false;
    $scope.hasForecast = false;
    $scope.timeseries = undefined;

    $scope.isLoading = false;
    $scope.isReload = false;
    $scope.tableState;

    $scope.fromIndex = undefined;
    $scope.toIndex = undefined;
    $scope.fromPoint = undefined;
    $scope.toPoint = undefined;
    $scope.rangeFromIndex = undefined;
    $scope.rangeToIndex = undefined;

    $scope.categories = undefined;

    $scope.threshhold = undefined;
    
    $scope.currentCategory - undefined;
    $scope.timeSeriesMetricFields = undefined;
    $scope.timeSeriesXAxis = undefined;
    $scope.forecastModels = undefined;

    angular.extend(this, $controller('ebaasFormBaseCtrl', { $rootScope: $rootScope, $scope: $scope, $http: $http, APP_CONFIG: APP_CONFIG }));

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
                    DataViewerService.getTimeSeriesCategories($scope.dbschema, $scope.dbclass, $scope.oid, $scope.xmlSchemaName, function (categories) {
                        $scope.categories = categories;
                        if (categories && categories.length > 0) {
                            $scope.currentCategory = categories[0];
                        }

                        DataViewerService.getTimeSeriesMetrciFields($scope.dbschema, $scope.dbclass, $scope.xmlSchemaName, function (fields) {
                            $scope.timeSeriesMetricFields = fields;
                            $scope.timeSeriesXAxis = GetXAxis(fields);
                            if (!$scope.isDateTimeXAxis()) {
                                $scope.currentFrequency = "None";
                            }

                            DataViewerService.getTimeSeriesMetric($scope.dbschema, $scope.dbclass, $scope.oid, $scope.xmlSchemaName, $scope.currentCategory, start, number, $scope.isReload, function (result) {
                                if (result) {
                                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update

                                    $scope.displayData(result);

                                    if ($scope.currentField) {
                                        $scope.displayChart();
                                    }

                                    $scope.isLoading = false;
                                    $scope.isReload = false;
                                }
                            })
                        })
                    })
                }
                else
                {
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

                        if ($scope.currentField) {
                            $scope.displayChart();
                        }

                        $scope.isLoading = false;
                        $scope.isReload = false;
                    }
                })
            }
        }
    }

    $scope.closeModal = function () {
        $modalInstance.dismiss("dismiss");
    };

    $scope.displayData = function (result) {

        $scope.currentField = undefined;
        var data = result.data;
        
        if (data && data.length > 0) {
            var row = data[0];
            var fields = [];
            var nonIndexFields = [];

            for (var key in row) {
                if (row.hasOwnProperty(key)) {
                    fields.push(key);
                    if (key != "Index" && !isXAxis(key))
                    {
                        nonIndexFields.push(key);

                        if (!$scope.currentField) {
                            $scope.currentField = key;
                        }
                    }
                }
            }

            $scope.displayed = data;

            $scope.fields = fields;
            $scope.nonIndexFields = nonIndexFields;
        }
    };

    function GetXAxis(fields)
    {
        var xAxis = undefined;
        if (fields) {
            for (var i = 0; i < fields.length; i++)
            {
                var column = fields[i];

                if (column["xaxis"] && column["xaxis"] == true)
                {
                    xAxis = column;
                }
            }
        }

        return xAxis;
    }

    function isXAxis(key) {
        var status = false;

        if ($scope.timeSeriesXAxis &&
            $scope.timeSeriesXAxis["title"] == key)
        {
            status = true;
        }

        return status;
    }

    function getTimeSeriesName(title)
    {
        var name = title;

        if ($scope.timeSeriesMetricFields) {
            for (var i = 0; i < $scope.timeSeriesMetricFields.length; i++)
            {
                if ($scope.timeSeriesMetricFields[i]["title"] == title)
                {
                    name = $scope.timeSeriesMetricFields[i]["name"];
                    break;
                }
            }
        }

        return name;
    }

    function xAxisLabelGenerator(x) {
        if ($scope.timeseries)
        {
            if (x === parseInt(x, 10)) {
                if (x >= 0) {
                    if (x < $scope.timeseries.length) {
                        x = formatXVal($scope.timeseries[x]["Index"]);
                    }
                    else if ($scope.forecasteddata) {
                        var i = x - $scope.timeseries.length;
                        if (i < $scope.forecasteddata.length) {
                            x = formatXVal($scope.forecasteddata[i]["Index"]);
                        }
                    }
                }
            }
        }
   
        return x;
    }

    $scope.chartOptions =
        {
            series: {
                lines: {
                    show: true
                },
                points: {
                    show: true
                }
            },
            grid: {
                hoverable: true,
                clickable: true,
                tickColor: FlotConfig.chartBorderColor,
                borderWidth: 0,
                borderColor: FlotConfig.chartBorderColor
            },
            xaxis: {
                tickFormatter: xAxisLabelGenerator
            },
            selection: {
                mode: "x"
            },
            tooltip: false,
            tooltipOpts: {
                content: function (label, xval, yval, flotItem) {
                    return "";
                },
                defaultTheme: false
            },
            colors: [FlotConfig.chartSecond, FlotConfig.chartFourth]
        };

    $scope.hasModels = false;

    $scope.hasCategories = function () {
        if ($scope.categories && $scope.categories.length > 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    $scope.loadCategoryData = function()
    {
        $scope.isReload = false;
        $scope.callServer($scope.tableState);
    }

    $scope.getXLable = function()
    {
        if ($scope.timeSeriesXAxis)
        {
            return $scope.timeSeriesXAxis["title"]
        }
        else
        {
            return "x axis";
        }
    }

    $scope.isDateTimeXAxis = function ()
    {
        if ($scope.timeSeriesXAxis) {
            if ($scope.timeSeriesXAxis["type"] &&
                ($scope.timeSeriesXAxis["type"] == "dateTime" ||
                 $scope.timeSeriesXAxis["type"] == "date"))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else {
            return false;
        }
    }

    $scope.showThreshhold = function ()
    {
        if (isThreshholdInRange())
        {
            if ($scope.currentField) {
                $scope.displayChart();
            }
        }
        else
        {
            alert("The threshhold is out of range");
        }
    }

    $scope.displayChart = function () 
    {
        DataViewerService.getOneTimeSeries($scope.dbschema, $scope.dbclass, $scope.oid, $scope.xmlSchemaName,
            $scope.currentCategory,
            $scope.currentField,
            $scope.currentFrequency,
            $scope.currentOperation,
            function (result) {
                $scope.timeseries = result.data;
                if ($scope.timeseries &&
                    $scope.timeseries.length > 0) {
                    $scope.fromIndex = 0;
                    $scope.toIndex = $scope.timeseries.length - 1;
                    $scope.fromPoint = formatXVal($scope.timeseries[$scope.fromIndex]["Index"]);
                    $scope.toPoint = formatXVal($scope.timeseries[$scope.toIndex]["Index"]);
                }

   
                DataViewerService.getModelInfos($scope.dbschema, $scope.dbclass, $scope.xmlSchemaName,
                    getTimeSeriesName($scope.currentField),
                    $scope.currentFrequency,
                    function (modelInfos) {
                        if (modelInfos.length > 0)
                        {
                            $scope.hasModels = true;
                            $scope.forecastModels = modelInfos;
                            setMaxForecastOptions(modelInfos);
                        }
                        else
                        {
                            $scope.hasModels = false;
                            $scope.forecastModels = undefined;
                        }

                        drawChart(result.data, 0, result.data.length);
                    })
            });
    };

    function drawChart(data, from, to)
    {
        $scope.lineChartData = [
             {
                 data: _.range(from, to).map(function (i) {
                     return [i, data[i][$scope.currentField]];
                 }),
                 label: $scope.currentField
             }
        ];

        if ($scope.threshhold)
        {
            var line2 = {
                data: _.range(from, to).map(function (i) {
                    return [i, $scope.threshhold];
                }),
                dashes: { show: true },
                points: { show: false },
                color: "#83ce16"
            };

            $scope.lineChartData.push(line2);
        }

        var plot = $.plot($('#plotChart'), $scope.lineChartData, $scope.chartOptions);

        plot.setData($scope.lineChartData);
        plot.setupGrid(); //only necessary if your new data will change the axes or grid
        plot.draw();
    }

    function setMaxForecastOptions(modelInfos)
    {
        var options = [];
 
        for (var i = 0; i < modelInfos.length; i++)
        {
            var option = {};
            option["id"] = modelInfos[i]["ModelDirName"];
            var optionName = modelInfos[i]["MaxForecast"];
            if ($scope.isDateTimeXAxis()) {
                optionName += $scope.currentFrequency;
            }
            else
            {
                optionName += $scope.timeSeriesXAxis["title"];
            }
            option["name"] = optionName;
            options.push(option);
        }

        if (options.length > 0)
        {
            $scope.currentModelId = modelInfos[0]["ModelDirName"];
        }

        $scope.maxForecasts = options;
    }

    function isThreshholdInRange()
    {
        var status = true;

        return status;
    }

    $scope.canZoomout = function ()
    {
        return $scope.isZoomIn || $scope.hasForecast;
    }

    $scope.zoomOutChart = function () {
        zoomInOutChart(undefined, undefined);
    }

    $scope.canZoomIn = function ()
    {
        if ($scope.rangeFromIndex && $scope.rangeToIndex)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    $scope.zoomIn = function (from, to) {
        if (from && to) {
            $scope.rangeFromIndex = Math.round(from);
            $scope.rangeToIndex = Math.round(to);
            if ($scope.timeseries && $scope.timeseries.length > 0) {
                $scope.fromPoint = formatXVal($scope.timeseries[$scope.rangeFromIndex]["Index"]);
                $scope.toPoint = formatXVal($scope.timeseries[$scope.rangeToIndex]["Index"]);
            }
        }
    }

    $scope.zoomInChart = function () {
        zoomInOutChart($scope.rangeFromIndex, $scope.rangeToIndex);
    }

    function zoomInOutChart(from, to) {
        if (from && to) {
            $scope.fromIndex = Math.round(from);
            $scope.toIndex = Math.round(to);
            if ($scope.timeseries &&
                $scope.fromIndex >= 0 && $scope.fromIndex < $scope.timeseries.length &&
                $scope.toIndex >= 0 && $scope.toIndex < $scope.timeseries.length) {
                $scope.isZoomIn = true;

                drawChart($scope.timeseries, $scope.fromIndex, $scope.toIndex);
            }
        }
        else {
            $scope.isZoomIn = false;
            $scope.hasForecast = false;
            if ($scope.timeseries && $scope.timeseries.length > 0) {
                $scope.fromIndex = 0;
                $scope.toIndex = $scope.timeseries.length - 1;
                $scope.fromPoint = formatXVal($scope.timeseries[$scope.fromIndex]["Index"]);
                $scope.toPoint = formatXVal($scope.timeseries[$scope.toIndex]["Index"]);
                $scope.rangeFromIndex = undefined;
                $scope.rangeToIndex = undefined;
                drawChart($scope.timeseries, 0, $scope.timeseries.length);
            }
            else {
                $scope.fromIndex = undefined;
                $scope.toIndex = undefined;
                $scope.fromPoint = undefined;
                $scope.toPoint = undefined;
                $scope.rangeFromIndex = undefined;
                $scope.rangeToIndex = undefined;
            }
        }
    }

    $scope.forecasteddata = undefined;

    $scope.forecast = function()
    {
        var from = $scope.fromIndex;
        var to = $scope.toIndex; // to + 1 is the last point
        var rangeFrom = undefined;
        var rangTo = undefined;
        if ($scope.rangeFromIndex && $scope.rangeToIndex)
        {
            rangeFrom = $scope.rangeFromIndex;
            rangTo = $scope.rangeToIndex;
        }
        else
        {
            rangeFrom = from;
            rangTo = to;
        }

        var data = $scope.timeseries;
        // orignal line
        $scope.lineChartData = [
            {
                data: _.range(from, to + 1).map(function (i) {
                    return [i, data[i][$scope.currentField]];
                }),
                label: $scope.currentField
            }
        ];

        var timeSeries = getTimeSeriesArray($scope.timeseries, rangeFrom, rangTo);
        DataViewerService.forecastTimeSeries($scope.dbschema, $scope.dbclass, $scope.currentModelId, timeSeries, function (result) {
           
            $scope.forecasteddata = result.data;

            // connecting line
            var d2 = {
                data: [[rangTo, $scope.timeseries[rangTo][$scope.currentField]], [rangTo + 1, $scope.forecasteddata[0][$scope.currentField]]],
                label: "",
                color: "#FF7070"
            };
            $scope.lineChartData.splice(0, 0, d2);

            var d3 = {
                data: _.range($scope.forecasteddata.length).map(function (i) {
                    return [rangTo + 1 + i, $scope.forecasteddata[i][$scope.currentField]];
                }),
                label: $rootScope.getWord("Forecasted") + $scope.currentField,
                color: "#FF7070"
            };

            $scope.lineChartData.push(d3);
            $scope.hasForecast = true;

            if ($scope.threshhold) {
                var threshTo;
                if ($scope.rangeFromIndex && $scope.rangeToIndex) {
                    // has selection
                    threshTo = to + 1;
                }
                else
                {
                    threshTo = to + 1 + $scope.forecasteddata.length;
                }

                var l2 = {
                    data: _.range(from, threshTo).map(function (i) {
                        return [i, $scope.threshhold];
                    }),
                    dashes: { show: true },
                    points: { show: false },
                    color: "#83ce16"
                };

                $scope.lineChartData.push(l2);
            }

            var plot = $.plot($('#plotChart'), $scope.lineChartData, $scope.chartOptions);

            var ranges = {};
            ranges.xaxis = {};
            ranges.xaxis.from = rangeFrom;
            ranges.xaxis.to = rangTo;
            plot.setSelection(ranges, true);

            plot.setData($scope.lineChartData);
            plot.setupGrid(); //only necessary if your new data will change the axes or grid
            plot.draw();
        });
    }

    $scope.canExport = function () {
        if ($scope.xmlSchemaName)
        {
            return true;
        }
        else
        {
            return false;
        }
    };

    $scope.canDownload = function () {
        if ($scope.timeseries)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    $scope.downloadTimeSeries = function()
    {
        exportToCsv($scope.currentField + ".csv", $scope.timeseries, $scope.fromIndex, $scope.toIndex); // download as csv
    }

    $scope.RefreshData = function () {
        $scope.isReload = false;
        $scope.xmlSchemaName = undefined; // fresh load
        $scope.callServer($scope.tableState);
    }

    $scope.ExportCSV = function()
    {
        $scope.isLoading = true;
        if ($scope.xmlSchemaName) {
            DataViewerService.downloadTimeSeries($scope.dbschema, $scope.dbclass, $scope.oid, $scope.xmlSchemaName, $scope.currentCategory, function () {
                $scope.isLoading = false;
            })
        }
    }

    function exportToCsv(filename, rows, fromIndex, toIndex) {
        var processRow = function (row) {
            var finalVal = '';
            var j = 0;
            for (var key in row) {
                if (row.hasOwnProperty(key)) {
                    var innerValue = row[key] === null ? '' : row[key].toString();
                    var result = innerValue.replace(/"/g, '""');
                    if (result.search(/("|,|\n)/g) >= 0)
                        result = '"' + result + '"';
                    if (j > 0)
                        finalVal += ',';
                    finalVal += result;
                    j++;
                }
            }
            return finalVal + '\n';
        };

        var csvFile = '';
        var from = fromIndex;
        var length = toIndex + 1; // inlucde the last point
       
        var i = from;
        for (; i < length; i++) {
            csvFile += processRow(rows[i]);
        }

        var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
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
    }

    function getTimeSeries(rows, fromIndex, toIndex) {
        var processRow = function (row) {
            var finalVal = '';
            var j = 0;
            for (var key in row) {
                // we don't need index value
                if (key != "Index" &&
                    row.hasOwnProperty(key)) {
                    var innerValue = row[key] === null ? '' : row[key].toString();
                    var result = innerValue.replace(/"/g, '""');
                    if (result.search(/("|,|\n)/g) >= 0)
                        result = '"' + result + '"';
                    if (j > 0)
                        finalVal += ',';
                    finalVal += result;
                    j++;
                }
            }
            return finalVal;
        };

        var ts = "";
        var from = fromIndex;
        var length = toIndex + 1; // inlucde the last point
        
        var i = from;
        for (; i < length; i++) {
            if (ts.length > 0)
                ts += ";";
            ts += processRow(rows[i]);
        }

        return ts;
    }

    function getTimeSeriesArray(rows, fromIndex, toIndex) {
        var ts = [];
        var from = fromIndex;
        var length = toIndex + 1; // inlucde the last point

        var i = from;
        for (; i < length; i++) {
            var point = rows[i];
            ts.push(point);
        }

        return ts;
    }

    function isInt(value) {
        return !isNaN(value) &&
               parseInt(Number(value)) == value &&
               !isNaN(parseInt(value, 10));
    }

    function formatXVal(xval)
    {
        if (!isInt(xval)) {
            // formating datetime string which is in form of yyyy-MM-dd hh:mm:ss
            var dateTime = xval.split(" ");
            var str = xval;
            if (dateTime.length > 0)
            {
                var date = dateTime[0].split("-");
                str = "";
                if (date.length > 0)
                {
                    if (showDate()) {
                        str += date[0] + $rootScope.getWord("YearSeparator"); // year
                    }

                    if (date.length > 1)
                    {
                        if (showDate()) {
                            //var mm = date[1] - 1;
                            str += date[1] + $rootScope.getWord("MonthSeparator"); // month
                        }

                        if (date.length > 2)
                        {
                            if (showDate()) {
                                str += date[2] + $rootScope.getWord("DaySeparator"); // day
                            }

                            if (dateTime.length > 1)
                            {
                                var time = dateTime[1].split(":");
                                if (time.length > 0)
                                {
                                    str += time[0] + $rootScope.getWord("HourSeparator"); // hour

                                    if (time.length > 1)
                                    {
                                        str += time[1] + $rootScope.getWord("MinuteSeparator"); // minute

                                        if (time.length > 2)
                                        {
                                            //var s = parseInt(time[2]); //get rid of that 00.0;
                                            str += time[2] + $rootScope.getWord("SecondSeparator"); // second
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return str;
        }
        else
        {
            return xval; // if x value is integer, no formatting
        }
    }

    function showDate()
    {
        if ($scope.currentFrequency === "Minute" || 
            $scope.currentFrequency === "Second")
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    // file directory code
    // url to get a directory tree
    $scope.baseUrl = APP_CONFIG.ebaasRootUrl;
    if (APP_CONFIG.hashedBaseUrls[$stateParams.cmdHash]) {
        $scope.baseUrl = APP_CONFIG.hashedBaseUrls[$stateParams.cmdHash];
    }

    var url = $scope.baseUrl + "/api/file/directory/" + $stateParams.schema + "/" + $stateParams.class + "/" + $stateParams.oid;
    $http.get(url).then(function (res) {

        var tree = createDirectoryTree(res.data);

        $scope.directoryTree = tree;
    });

    var createDirectoryTree = function (rootDir) {
        var roots = [];

        var root = {};
        root.name = rootDir.name;
        root.title = rootDir.name;
        root.children = [];
        root.expanded = true;
        root.parent = undefined;
        roots.push(root);

        addSubDirs(root, rootDir.subdirs);

        return roots;
    };

    var addSubDirs = function (parent, subDirs) {
        var subDir, node;

        for (var i = 0; i < subDirs.length; i += 1) {
            subDir = subDirs[i];
            node = {};
            node.children = [];

            node.name = subDir.name;
            node.title = subDir.name;
            node.children = [];
            node.expanded = true;
            node.parent = parent;

            parent.children.push(node);

            addSubDirs(node, subDir.subdirs);
        }
    };

    $scope.$watch('directory.currentNode', function (newObj, oldObj) {
        if ($scope.directory && angular.isObject($scope.directory.currentNode)) {

            $rootScope.$broadcast('directory.changedNode', { newNode: newObj });
        }
    }, false);

    $scope.addTimeSeries = function()
    {
        var frequency = $scope.currentFrequency;
        if (!$scope.isDateTimeXAxis())
        {
            frequency = "None";
        }
        $state.go(".timeseries", {frequency : frequency, ts: getTimeSeries($scope.timeseries, $scope.fromIndex, $scope.toIndex)});
    }
});
