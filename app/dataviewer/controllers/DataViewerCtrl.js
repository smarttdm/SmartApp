'use strict';

angular.module('app.dataviewer').controller('DataViewerCtrl', function ($controller, $scope, $rootScope, $http, $stateParams, APP_CONFIG, DataViewerService, FlotConfig) {

    $scope.backTitle = $rootScope.getWord("Back");
    $scope.title = $rootScope.getWord("Test Data");

    console.debug("data viewer ");

    $scope.goBackToPrev = function () {
        console.debug("go back");
        history.back(1);
    }

    angular.extend(this, $controller('DataViewerBaseCtrl', { $scope: $scope, $rootScope: $rootScope, $http: $http, $stateParams: $stateParams, APP_CONFIG: APP_CONFIG, DataViewerService: DataViewerService, FlotConfig: FlotConfig }));
  
});
