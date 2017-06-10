"use strict";	

angular.module('app.homepage').controller("myActivitiesCtrl", function ActivitiesCtrl($scope, $log, $state, APP_CONFIG, User, myActivityService) {

	$scope.activeTab = 'default';
	$scope.currentActivityItems = [];

	// Getting different type of activites
	myActivityService.get(function(data){

		$scope.activities = data.activities;
		
	});

	$scope.isActive = function (tab) {
		return $scope.activeTab === tab;
	};

	$scope.setTab = function (activityType) {
		$scope.activeTab = activityType;

		myActivityService.getbytype(activityType, function(data) {
			$scope.currentActivityItems = data;

		});

	};

	$scope.setTab("msgs");

	$scope.getPosterImage = function(posterId)
	{
	    return User.getUserImage(posterId);
	}

	$scope.readMsg = function(msg)
	{
	    var url = msg.url;
	    var urlparams = msg.urlparams;
        
	    urlparams = urlparams.replace(/msg.dbschema/, "\"" + msg.dbschema + "\""); // replace msg.dbschema
	    urlparams = urlparams.replace(/msg.dbclass/, "\"" + msg.dbclass + "\""); // replace msg.dbclass
	    urlparams = urlparams.replace(/msg.oid/, "\"" + msg.oid + "\""); // replace msg.dbclass

	    var params = JSON.parse(urlparams);

	    var found = false;
	    var index = undefined;
	  
	    for (var i = 0; i < $scope.currentActivityItems.length; i++) {
	        var activity = $scope.currentActivityItems[i];
	        if (activity.objId === msg.objId) {
	            index = i;
	            found = true;
	            break;
	        }
	    }

	    if (found) {
	        $scope.currentActivityItems.splice(index, 1);
	    }
	   
	    myActivityService.remove("msgs", msg.objId, function (data) {	       
	        if (url) {
	            $state.go(url, params);
	        }
	    });
	}

	$scope.ClearUserMessages = function()
	{
	    myActivityService.removeAll("msgs", function () {
	        $scope.currentActivityItems = [];
	    });
	}
});