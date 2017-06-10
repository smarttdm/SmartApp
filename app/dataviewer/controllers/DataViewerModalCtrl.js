'use strict';

angular.module('app.dataviewer').controller('DataViewerModalCtrl', function ($controller, $scope, $rootScope, $http, $stateParams, APP_CONFIG, $modalInstance, DataViewerService, FlotConfig) {

    angular.extend(this, $controller('DataViewerBaseCtrl', { $scope: $scope, $rootScope: $rootScope, $http: $http, $stateParams: $stateParams, APP_CONFIG: APP_CONFIG, DataViewerService: DataViewerService, FlotConfig: FlotConfig }));
   
    $scope.closeModal = function () {
        $modalInstance.dismiss("dismiss");
    };

});
