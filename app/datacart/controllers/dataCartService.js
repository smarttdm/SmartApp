"use strict";

angular.module('app.datacart').factory('dataCartService', function ($http, APP_CONFIG) {

    function getColumns(dbschema, dbclass, dbview, callback) {
        var url;
        if (dbview) {
            url = APP_CONFIG.ebaasRootUrl + "/api/metadata/view/" + encodeURIComponent(dbschema) + "/" + dbclass + "?view=" + dbview;
        }
        else
        {
            url = APP_CONFIG.ebaasRootUrl + "/api/metadata/view/" + encodeURIComponent(dbschema) + "/" + dbclass;
        }

        $http.get(url).success(function (data) {

            var column;
            var columns = new Array();

            // data is a JSON Schema for the class
            var properties = data.properties; // data.properies contains infos of each property of the schema

            var propertyInfo;
            for (var property in properties) {
                if (properties.hasOwnProperty(property)) {
                    propertyInfo = properties[property];
                    column = new Object();
                    column.name = property;
                    column.title = propertyInfo["title"];

                    columns.push(column);
                }
            }
            callback(columns);
        }).error(function () {
            callback([]);

        });
    }

    function getCartItem(dbschema, dbclass, dbview, oid, callback) {

        var url;

        // get data for the items saved in the cart
        if (dbview) {
            url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent(dbschema) + "/" + dbclass + "/" + oid + "?view=" + dbview;
        }
        else
        {
            url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent(dbschema) + "/" + dbclass + "/" + oid;
        }
        $http.get(url).success(function (data) {
            callback(data);
        }).error(function () {
            callback([]);
        });
    }

    function getReportTemplates(dbschema, dbclass, callback) {

        // get data for the items saved in the cart
        var url = APP_CONFIG.ebaasRootUrl + "/api/report/templates/" + encodeURIComponent(dbschema) + "/" + dbclass;

        $http.get(url).success(function (data) {
            console.log(data);
            callback(data);
        }).error(function () {
            callback([]);
        });
    }

    return {
        getColumns: function (dbschema, dbclass, dbview, callback) {
            getColumns(dbschema, dbclass, dbview, callback);
        },
        getCartItem: function (dbschema, dbclass, dbview, oid, callback) {
            getCartItem(dbschema, dbclass, dbview, oid, callback);
        },
        getReportTemplates: function (dbschema, dbclass, callback) {
            getReportTemplates(dbschema, dbclass, callback);
        }
	}
});