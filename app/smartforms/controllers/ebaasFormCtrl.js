'use strict';

angular.module('app.smartforms').controller('ebaasFormCtrl', function ($controller, $rootScope, $scope, $http, APP_CONFIG, $state, $stateParams, parentStateName) {

    $scope.dbschema = $stateParams.schema;
    $scope.dbclass = $stateParams.class;
    $scope.oid = $stateParams.oid;
    $scope.template = $stateParams.template;
    $scope.formAttribute = $stateParams.formAttribute;
    $scope.parentStateName = parentStateName;
    $scope.readonly = false;

    angular.extend(this, $controller('ebaasFormBaseCtrl', { $rootScope: $rootScope, $scope: $scope, $http: $http, APP_CONFIG: APP_CONFIG}));
});
