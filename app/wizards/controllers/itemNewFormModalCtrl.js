'use strict';

angular.module('app.wizards').controller('itemNewFormModalCtrl', function ($controller, $rootScope, $scope, $http, APP_CONFIG, $stateParams, $modalInstance, RequestInfo) {
 
    $scope.dbschema = $stateParams.schema;
    $scope.dbclass = $stateParams.rclass;
    $scope.template = $stateParams.rtemplate;

    // inform the parent controller to load a clone instance as initial values in the form
    $scope.cloneclass = RequestInfo.params['itemTemplateClass'];
    $scope.cloneid = $stateParams.tid;

    angular.extend(this, $controller('ebaasFormBaseCtrl', { $rootScope: $rootScope, $scope: $scope, $http: $http, APP_CONFIG: APP_CONFIG}));

    $scope.submitItemForm = function ()
    {
        // set relationship to request before submit
        var toRequest = RequestInfo.params['itemToRequest'];
        $scope.model[toRequest] = RequestInfo.requestPk();

        $scope.submitForm(null);
    }

    $scope.goBack = function () {
        if ($scope.submitted)
            $modalInstance.close("itemupdate");
        else
            $modalInstance.dismiss("dismiss");
    };
});
