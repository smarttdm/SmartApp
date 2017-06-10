'use strict';

angular.module('SmartAdmin.Layout').controller('bigBreadcrumbsCtlr', function ($rootScope, $scope, $stateParams, $http, APP_CONFIG) {

    $scope.helpUrl = undefined;
    if ($stateParams.hash)
    {
        $scope.hasHashCode = true;
    }
    else
    {
        $scope.hasHashCode = false;
    }

    $scope.getWord = function(key)
    {
        return $rootScope.getWord(key);
    }

});
