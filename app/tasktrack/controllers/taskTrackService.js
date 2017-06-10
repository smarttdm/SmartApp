"use strict";

angular.module('app.tasktrack').factory('taskTrackService', function ($http, APP_CONFIG, hubService) {

    function getTaskResult(dbschema, taskclass, start, pageSize, params, callback) {
	    
        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent(dbschema) + "/" + taskclass + "?view=full&from=" + start + "&size=" + pageSize;
	
        var filters = params.search.predicateObject;
        var count = 0;
        var expre = [];
        if (filters)
        {
            var filter;
            for (var property in filters) {
                if (filters.hasOwnProperty(property)) {
                    filter = [];
                    filter.push(property);
                    if (property === "Subject") {
                        filter.push("contains");
                    }
                    else {
                        filter.push("=");
                    }
                    filter.push(filters[property]);
                }

                count++;

                if (count === 1) {
                    expre.push(filter);
                }
                else
                {
                    expre.push("and");
                    expre.push(filter);
                }
            }

            if (count > 0) {
                if (count === 1) {
                    url += "&filter=" + JSON.stringify(expre[0]); // single filter
                }
                else {
                    url += "&filter=" + JSON.stringify(expre); // compound filter
                }
            }
        }

        var sortField = params.sort.predicate;
        var sortReverse = params.sort.reverse;
        if (sortField)
        {
            url += "&sortfield=" + sortField + "&sortreverse=" + sortReverse;
        }

        hubService.getUserGroups(function (groups) {

            $http.get(url).success(function (data) {
                var result = new Object();
                addTrackStatus(dbschema, data, groups);
                result.data = data;

                url = APP_CONFIG.ebaasRootUrl + "/api/count/" + encodeURIComponent(dbschema) + "/" + taskclass;
                if (count > 0) {
                    if (count === 1) {
                        url += "?filter=" + JSON.stringify(expre[0]); // single filter
                    }
                    else {
                        url += "?filter=" + JSON.stringify(expre); // compound filter
                    }
                }
                $http.get(url).success(function (data) {
                    var numberOfPages = Math.ceil(data / pageSize);
                    result.numberOfPages = numberOfPages;
                    callback(result);
                }).error(function () {
                    callback(undefined);

                });
            }).error(function () {
                callback(undefined);
            });
        });
    }

    function getOneTask(dbschema, taskclass, oid, callback) {

        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent(dbschema) + "/" + taskclass + "/" + oid

        hubService.getUserGroups(function (groups) {

            $http.get(url).success(function (data) {
                var array = [];
                array.push(data);
                var result = new Object();
                addTrackStatus(dbschema, array, groups);
                result.data = array;
                result.numberOfPages = 1;
                callback(result);

            }).error(function () {
                callback(undefined);
            });
        });
    }

    function addTrackStatus(dbschema, data, userGroups)
    {
        if (data && data.length > 0)
        {
            for (var i = 0; i < data.length; i++)
            {
                data[i].TrackStatus = false;
                var groupName = dbschema + "-" + data[i].type + "-" + data[i].obj_id;
                for (var j = 0; j < userGroups.length; j++)
                {
                    if (userGroups[j] === groupName)
                    {
                        data[i].TrackStatus = true;
                        break;
                    }
                }
            }
        }
    }
	
	return {
	    getTaskResult: function (dbschema, taskclass, start, pagesize, tableState, callback) {
	        getTaskResult(dbschema, taskclass, start, pagesize, tableState, callback);
	    },
	    getOneTask: function (dbschema, taskclass, oid, callback) {
	        getOneTask(dbschema, taskclass, oid, callback);
	    }
	}
});