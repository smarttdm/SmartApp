"use strict";

angular.module('app.homepage').factory('myActivityService', function ($http, $rootScope, $log, APP_CONFIG) {

    var MessageModel = {
        count : 0
    };

    function getActivities(callback) {

        $http.get(APP_CONFIG.apiRootUrl + '/activities/activity.json').success(function (data) {

            callback(data);

        }).error(function () {

            $log.log('Error');
            callback([]);

        });
    }

	function getTasks(callback) {

	    var url = APP_CONFIG.ebaasRootUrl + "/api/tasks/" + encodeURIComponent(APP_CONFIG.dbschema);
	    $http.get(url).success(function (data) {

	        callback(data);

	    }).error(function () {

	        $log.log('Error');
	        callback([]);
	    });
	}

	function getActivitiesByType(type, callback){

	    if (type === "msgs") {
	        $http.get(APP_CONFIG.ebaasRootUrl + '/api/messages').success(function (data) {

	            MessageModel.count = data.length;
	            callback(data);
	        }).error(function () {

	            $log.log('Error');
	            callback([]);
	        });
	    }
	    else
	    {
	        callback([]);
	    }
	}

	function createActivitiesByType(type, msg, callback) {

	    if (type === "msgs") {
	        var groupName = msg.dbschema + "-" + msg.dbclass + "-" + msg.oid;
	        $http.post(APP_CONFIG.ebaasRootUrl + '/api/messages/' + encodeURIComponent(groupName), msg).success(function (data) {
	            callback(data);
	        }).error(function () {
	            $log.log('Error');
	            callback([]);
	        });
	    }
	    else {
	        callback([]);
	    }
	}

	function addActivityByType(type, activity)
	{
	    if (type === "msgs") {
	        MessageModel.count++;
	        $rootScope.$apply(); // this is outside of angularjs, so need to digest
	        $.smallBox({
	            title: $rootScope.getWord('NewMessage'),
	            content: "<i class='fa fa-info'></i> <i>" + activity.Subject + "</i>",
	            color: "#5F895F",
	            iconSmall: "fa fa-check bounce animated",
	            timeout: 8000
	        });
	    }
	    else if (type === "tasks") {
	        MessageModel.count++;
	        $rootScope.$apply(); // this is outside of angularjs, so need to digest
	        $.smallBox({
	            title: $rootScope.getWord('NewTask'),
	            content: "<i class='fa fa-info'></i> <i>" + activity.Subject + "</i>",
	            color: "#5F895F",
	            iconSmall: "fa fa-check bounce animated",
	            timeout: 8000
	        });
	    }
	}

	function removeActivitiesByType(type, oid, callback) {

	    if (type === "msgs") {
	        $http.delete(APP_CONFIG.ebaasRootUrl + '/api/messages/' + oid).success(function (data) {

	            if (MessageModel.count > 0) {
	                MessageModel.count--;
	            }

	            callback(data);

	        }).error(function () {

	            $log.log('Error');
	            callback([]);

	        });
	    }
	    else {
	        callback([]);
	    }
	}

	function removeAllActivitiesByType(type, callback) {

	    if (type === "msgs") {
	        $http.delete(APP_CONFIG.ebaasRootUrl + '/api/messages').success(function () {

	            MessageModel.count = 0;

	            callback();

	        }).error(function () {

	            $log.log('Error');
	            callback();

	        });
	    }
	    else {
	        callback();
	    }
	}
	
	return {
	    MessageModel: function()
	    {
	        return MessageModel;
	    },
	    get: function (callback) {
	        getActivities(callback);
	    },
		getTasks:function(callback) {
		    getTasks(callback);
		},
		getbytype:function(type,callback){
			getActivitiesByType(type, callback);
		},
		create: function(type, activity, callback) {
		    createActivitiesByType(type, activity, callback);
		},
		add: function(type, activity)
		{
		    addActivityByType(type, activity);
		},
		remove: function(type, oid, callback) {
		    removeActivitiesByType(type, oid, callback);
		},
		removeAll: function(type, callback) {
		    removeAllActivitiesByType(type, callback);
		}
	}
});