'use strict';

angular.module('app.wizards').controller('requestInfoStepCtrl', function ($controller, $rootScope, $scope, $http, APP_CONFIG, $stateParams, RequestInfo) {

    $scope.dbschema = this.dbschema;
    $scope.dbclass = this.dbclass;
    $scope.template = this.template;
    $scope.control = this.control;
    $scope.oid = "";
    if (RequestInfo.requestId())
    {
        $scope.oid = RequestInfo.requestId();
    }

    $scope.callbackMethod = this.callbackMethod;
    $scope.formId = "CreateTestRequestFormWizard"; // this will be posted as headers to the server to identify the form(optional)

    // implement standard wizard step method
    $scope.control.goNextError = function () {
        $scope.submitted = true;
        if (!$scope.ebaasform.$valid) { // we don't check dirty since nested form may have row deleted which doesn't flag as dirty
            $scope.message = $rootScope.getWord('ValidationError');
            return $scope.message;
        }
        else {
            $scope.message = "";
            return $scope.message;
        }
    }

    $scope.control.goPrevError = function () {
        return "";
    }

    $scope.control.goNext = function () {
        $scope.oid = RequestInfo.requestId();
  
        // create an new request or save the existing request
        $scope.submitForm($scope.callbackMethod);

    }

    $scope.control.goPrev = function () {

    }

    $scope.control.init = function () {
        if (RequestInfo.instance)
        {
            $scope.model = RequestInfo.instance;
        }
    }

    angular.extend(this, $controller('ebaasFormBaseCtrl', { $rootScope: $rootScope, $scope: $scope, $http: $http, APP_CONFIG: APP_CONFIG, $stateParams: $stateParams }));

});
