"use strict";


angular.module('app.homepage').controller('mainChartsCtrl', function ($scope, $http, APP_CONFIG, promisedParams) {

    $scope.pageparams = promisedParams.data;
});