"use strict";

angular.module('app.dataviewer').factory('DataViewerService', function ($rootScope, $http, APP_CONFIG, fileManager) {

    function getTimeSeriesMetric(dbschema, dbclass, oid, xmlSchemaName, category, start, pageSize, reload, callback) {

        var url = APP_CONFIG.ebaasRootUrl + "/api/timeseries/metric/" + encodeURIComponent(dbschema) + "/" + dbclass + "/" + oid + "/" + xmlSchemaName + "?from=" + start + "&size=" + pageSize + "&reload=" + reload;
        if (category)
        {
            url += "&category=" + category;
        }

        $http.get(url).success(function (data) {
            var result = new Object();
            result.data = JSON.parse(data); // convert string to json
            
            // total point count
            url = APP_CONFIG.ebaasRootUrl + "/api/timeseries/metric/count/" + encodeURIComponent(dbschema) + "/" + dbclass + "/" + oid + "/" + xmlSchemaName;
            if (category) {
                url += "?category=" + category;
            }
            $http.get(url).success(function (count) {
               
                result.numberOfPages = Math.ceil(count / pageSize);
                result.count = count;
                callback(result);
            }).error(function () {
                callback({});
            });
        }).error(function () {
            callback({});
        });
    }

    function getTimeSeriesCategories(dbschema, dbclass, oid, xmlSchemaName, callback) {

        var url = APP_CONFIG.ebaasRootUrl + "/api/timeseries/metric/categories/" + encodeURIComponent(dbschema) + "/" + dbclass + "/" + oid + "/" + xmlSchemaName;

        $http.get(url).success(function (data) {
            callback(data);
        }).error(function () {
            callback({});
        });
    }

    function getOneTimeSeries(dbschema, dbclass, oid, xmlSchemaName, category, field, frequency, operation, callback) {

        var url = APP_CONFIG.ebaasRootUrl + "/api/timeseries/metric/" + encodeURIComponent(dbschema) + "/" + dbclass + "/" + oid + "/" + xmlSchemaName + "?field=" + field + "&frequency=" + frequency + "&operation=" + operation;

        if (category) {
            url += "&category=" + category;
        }

        $http.get(url).success(function (data) {
            var result = new Object();
            result.data = JSON.parse(data); // convert string to json
            callback(result);
        }).error(function () {
            callback({});
        });
    }

    function getXmlSchemaName(dbschema, dbclass, oid, xmlSchemaProperty, callback) {

        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent(dbschema) + "/" + dbclass + "/" + oid;

        $http.get(url).success(function (data) {
            var xmlSchemaName = data[xmlSchemaProperty];
            callback(xmlSchemaName);
        }).error(function () {
            callback([]);

        });
    }

    function downloadTimeSeries(dbschema, dbclass, oid, xmlSchemaName, category, callback) {

        var url = APP_CONFIG.ebaasRootUrl + "/api/timeseries/metric/file/" + encodeURIComponent(dbschema) + "/" + dbclass + "/" + oid + "/" + xmlSchemaName;

        if (category) {
            url += "?category=" + category;
        }

        fileManager.performDownload(url, function () {
            callback();
        });
    }

    // modelId is unique with a dbclass
    function forecastTimeSeries(dbschema, dbclass, modelId, timeSeries, callback) {

        var url = APP_CONFIG.ebaasRootUrl + "/api/timeseries/field/forecast/" + encodeURIComponent(dbschema) + "/" + dbclass + "/" + modelId;

        $http.post(url, timeSeries).success(function (data) {
            var result = new Object();
            result.data = JSON.parse(data); // convert string to json
            callback(result);
        }).error(function () {
            callback({});
        });
    }

    function getModelInfos(dbschema, dbclass, xmlSchemaName, fieldName, frequency, callback) {
        var url = APP_CONFIG.ebaasRootUrl + "/api/timeseries/field/model/" + encodeURIComponent(dbschema) + "/" + dbclass + "/" + xmlSchemaName + "?field=" + fieldName + "&frequency=" + frequency;

        $http.get(url).success(function (data) {
            var result = [];
            if (data) {
                result = data;
            }
            callback(result);
        }).error(function () {
            callback([]);
        });
    }

    function getTimeSeriesMetrciFields(dbschema, dbclass, xmlSchemaName, callback) {
        var url = APP_CONFIG.ebaasRootUrl + "/api/timeseries/metric/fields/" + encodeURIComponent(dbschema) + "/" + dbclass + "/" + xmlSchemaName;

        $http.get(url).success(function (data) {
            var result = [];
            if (data) {
                result = data;
            }
            callback(result);
        }).error(function () {
            callback([]);
        });
    }

    function getFrequencyArray() {
        var frequencyArray = [];

        var item = {};
        item.id = "Second";
        item.name = $rootScope.getWord("Every Second");
        frequencyArray.push(item);

        item = {};
        item.id = "Minute";
        item.name = $rootScope.getWord("Every Minute");
        frequencyArray.push(item);

        item = {};
        item.id = "Hour";
        item.name = $rootScope.getWord("Every Hour");
        frequencyArray.push(item);

        item = {};
        item.id = "Day";
        item.name = $rootScope.getWord("Every Day");
        frequencyArray.push(item);

        item = {};
        item.id = "Month";
        item.name = $rootScope.getWord("Every Month");
        frequencyArray.push(item);

        return frequencyArray;
    }

    function getOperationArray() {
        var operationArray = [];

        var item = {};
        item.id = "Mean";
        item.name = $rootScope.getWord("Mean");
        operationArray.push(item);

        item = {};
        item.id = "Min";
        item.name = $rootScope.getWord("Min");
        operationArray.push(item);

        item = {};
        item.id = "Max";
        item.name = $rootScope.getWord("Max");
        operationArray.push(item);

        item = {};
        item.id = "Median";
        item.name = $rootScope.getWord("Median");
        operationArray.push(item);

        item = {};
        item.id = "FirstValue";
        item.name = $rootScope.getWord("FirstValue");
        operationArray.push(item);

        item = {};
        item.id = "LastValue";
        item.name = $rootScope.getWord("LastValue");
        operationArray.push(item);

        return operationArray;
    }

    return {
        getXmlSchemaName: function (dbschema, dbclass, oid, xmlSchemaProperty, callback)
        {
            getXmlSchemaName(dbschema, dbclass, oid, xmlSchemaProperty, callback);
        },
        getTimeSeriesMetric: function (dbschema, dbclass, oid, xmlSchemaName, category, start, pageSize, reload, callback) {
            getTimeSeriesMetric(dbschema, dbclass, oid, xmlSchemaName, category, start, pageSize, reload, callback);
        },
        getTimeSeriesCategories: function (dbschema, dbclass, oid, xmlSchemaName, callback) {
            getTimeSeriesCategories(dbschema, dbclass, oid, xmlSchemaName, callback);
        },
        getOneTimeSeries: function (dbschema, dbclass, oid, xmlSchemaName, category, field, frequency, operation, callback) {
            getOneTimeSeries(dbschema, dbclass, oid, xmlSchemaName, category, field, frequency, operation, callback);
        },
        downloadTimeSeries: function (dbschema, dbclass, oid, xmlSchemaName, category, callback) {
            downloadTimeSeries(dbschema, dbclass, oid, xmlSchemaName, category, callback);
        },
        forecastTimeSeries: function (dbschema, dbclass, modelId, timeSeries, callback) {
            forecastTimeSeries(dbschema, dbclass, modelId, timeSeries, callback);
        },
        getModelInfos: function (dbschema, dbclass, xmlSchemaName, fieldName, frequency, callback) {
            getModelInfos(dbschema, dbclass, xmlSchemaName, fieldName, frequency, callback);
        },
        getTimeSeriesMetrciFields: function (dbschema, dbclass, xmlSchemaName, callback) {
            getTimeSeriesMetrciFields(dbschema, dbclass, xmlSchemaName, callback);
        },
        getFrequencyArray: function () {
            return getFrequencyArray();
        },
        getOperationArray: function () {
            return getOperationArray();
        }
	}
});