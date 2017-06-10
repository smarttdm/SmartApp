"use strict";

angular.module('app.formeditor').factory('formEditorService', function ($http, APP_CONFIG) {

    var contextModel = {
        dbschema: undefined,
        dbclass: undefined
    };

    var formInfo = {
        dbclass: undefined,
        classTitle: undefined,
        formName: undefined
    }

    function getClassTreeData(dbschema, callback) {

        var url = APP_CONFIG.ebaasRootUrl + "/api/metadata/schematree/" + encodeURIComponent(dbschema);

        $http.get(url).success(function (data) {
            callback(data);
        }).error(function () {
            callback([]);

        });
    }

    function getRelationshipTreeData(dbschema, dbclass, callback) {

        var url = APP_CONFIG.ebaasRootUrl + "/api/metadata/relationtree/" + encodeURIComponent(dbschema) + "/" + dbclass;

        $http.get(url).success(function (data) {
            callback(data);
        }).error(function () {
            callback([]);

        });
    }

    function getClassProperties(dbschema, dbclass, callback) {

        var url = APP_CONFIG.ebaasRootUrl + "/api/metadata/view/" + encodeURIComponent(dbschema) + "/" + dbclass + "?view=full"

        $http.get(url).success(function (data) {
            //console.debug(JSON.stringify(data));
            callback(data);
        }).error(function () {
            callback([]);

        });
    }

    function getLeafClasses(dbschema, dbclass, callback) {

        var url = APP_CONFIG.ebaasRootUrl + "/api/metadata/leafclasses/" + encodeURIComponent(dbschema) + "/" + dbclass;

        $http.get(url).success(function (data) {
            callback(data);
        }).error(function () {
            callback([]);

        });
    }

    function getFormFiles(dbschema, dbclass, callback) {

        var url = APP_CONFIG.ebaasRootUrl + "/api/form/layouts/" + dbschema + "/" + dbclass;

        $http.get(url).success(function (data) {
            callback(data);
        }).error(function () {
            callback([]);

        });
    }

    function getFormFile(dbschema, dbclass, formName, callback) {

        var url = APP_CONFIG.ebaasRootUrl + "/api/form/layout/" + dbschema + "/" + dbclass + "/" + formName;

        $http.get(url).success(function (data) {
            callback(data);
        }).error(function () {
            callback([]);

        });
    }

    function saveFormFile(dbschema, dbclass, formName, content, callback) {

        var url = APP_CONFIG.ebaasRootUrl + "/api/form/layout/" + dbschema + "/" + dbclass + "/" + formName;

        $http.post(url, JSON.stringify(content)).success(function () {
            callback();
        }).error(function () {
            callback();

        });
    }

    return {
        contextModel: function()
        {
            return contextModel;
        },
        formInfo : function ()
        {
            return formInfo;
        },
        getFormFiles: function (dbschema, dbclass, callback)
        {
            getFormFiles(dbschema, dbclass, callback);
        },
        getFormFile: function (dbschema, dbclass, formName, callback) {
            getFormFile(dbschema, dbclass, formName, callback);
        },
        saveFormFile: function (dbschema, dbclass, formName, content, callback) {
            saveFormFile(dbschema, dbclass, formName, content, callback);
        },
        getClassTreeData: function (dbschema, callback) {
            getClassTreeData(dbschema, callback);
        },
        getRelationshipTreeData: function (dbschema, dbclass, callback) {
            getRelationshipTreeData(dbschema, dbclass, callback);
        },
        getLeafClasses: function (dbschema, dbclass, callback) {
            getLeafClasses(dbschema, dbclass, callback);
        },
        getClassProperties: function (dbschema, dbclass, callback) {
            getClassProperties(dbschema, dbclass, callback);
        }
	}
});