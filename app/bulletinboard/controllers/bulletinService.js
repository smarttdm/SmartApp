"use strict";

angular.module('app.bulletinboard').factory('bulletinService', function ($http, $rootScope, APP_CONFIG) {

    function getPublicPosts(dbschema, dbclass, callback) {

        var pageSize = 20;
        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent(dbschema) + "/" + dbclass + "?size=" + pageSize + "&filter=['IsPublic','=', '" + $rootScope.getWord("True") + "']";

        $http.get(url).success(function (data) {
            callback(data);

        }).error(function () {
            callback([]);

        });
    }

    function getPosts(dbschema, dbclass, callback) {

        var pageSize = 30;
        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent(dbschema) + "/" + dbclass + "?size=" + pageSize;

        $http.get(url).success(function (data) {
            callback(data);

        }).error(function () {
            callback([]);

        });
    }

    function getPostByID(dbschema, dbclass, oid, callback) {

        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent(dbschema) + "/" + dbclass + "/" + oid;

        $http.get(url).success(function (data) {
            callback(data);

        }).error(function () {
            callback([]);

        });
    }
 
	return {
	    getPosts: function (dbschema, dbclass, callback) {
	        getPosts(dbschema, dbclass, callback);
	    },
	    getPublicPosts: function (dbschema, dbclass, callback) {
	        getPublicPosts(dbschema, dbclass, callback);
	    },
	    getPostByID: function(dbschema, dbclass, oid, callback) {
	        getPostByID(dbschema, dbclass, oid, callback);
	    }
	}
});