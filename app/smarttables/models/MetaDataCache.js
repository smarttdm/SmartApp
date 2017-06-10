"use strict";

angular.module("app.smarttables").factory("MetaDataCache", function () {

    var cache = new Object();

    function _getClassView(dbschema, dbclass, view) {
        var data = undefined;
        var key = dbschema + "_" + dbclass + "_" + view;
        if (cache[key])
        {
            data = cache[key];
        }

        return data;
    }

    function _setClassView(dbschema, dbclass, view, data) {
        var key = dbschema + "_" + dbclass + "_" + view;
        cache[key] = data;
    }

    function _getNamedData(dataName) {
        var data = undefined;
        if (cache[dataName]) {
            data = cache[dataName];
        }

        return data;
    }

    function _setNamedData(dataName, data) {
        cache[dataName] = data;
    }

    return {
        getClassView: _getClassView,
        setClassView: _setClassView,
        getNamedData : _getNamedData,
        setNamedData : _setNamedData
    };
});