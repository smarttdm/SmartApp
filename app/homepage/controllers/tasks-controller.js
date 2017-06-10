"use strict";	

angular.module('app.homepage').controller("myTasksController", function ActivitiesCtrl($scope, APP_CONFIG, myActivityService) {

	// Getting different type of activites
	myActivityService.getTasks(function(data){
		$scope.tasks = data;
	});

	$scope.getDBSchema = function () {
	    return APP_CONFIG.dbschema;
	}
});