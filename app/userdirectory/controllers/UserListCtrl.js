'use strict';

angular.module('app.userdirectory').controller('UserListCtrl', function ($scope, $rootScope, $state, $stateParams, APP_CONFIG, userService, promisedUsers) {

    $scope.dbschema = $stateParams.schema;
    $scope.userclass = $stateParams.class;
    $scope.roleclass = "Role";

    $scope.getWord = function(key)
    {
        return key;
    }

    $scope.tableOptions = {
        "data": userService.convertUsers(promisedUsers.data),
        //            "bDestroy": true,
        "iDisplayLength": 20,
        "columns": [
            {
                "class": 'details-control',
                "orderable": false,
                "data": null,
                "defaultContent": ''
            },
            { "data": "FullName" },
            { "data": "ID" },
            { "data": "PhoneNumber" },
            { "data": "Email" }
        ],
        "order": [[1, 'asc']]
    }

    // Getting unit tree
    $scope.unitObjId = $stateParams.unitObjId;

    userService.getUnitTree($stateParams.schema, $scope.roleclass, $scope.unitObjId, function (data) {
        $scope.unitTree = data;

    });

    // Getting function list
    userService.getFunctions($stateParams.schema, $scope.roleclass, function (data) {
       
        $scope.functions = data;

    });

    $scope.functionObjId = $stateParams.functionObjId;
    $scope.getFunctionUsers = function (functionObjId) {
        var params = new Object();

        params.functionObjId = functionObjId;
        params.unitObjId = undefined;
        $scope.functionObjId = functionObjId;
        $scope.unitObjId = undefined;

        $state.go($state.current, params, { reload: true }); //second parameter is for $stateParams
    }

    $scope.getUnitUsers = function(unitObjId)
    {
        var params = new Object();

        params.unitObjId = unitObjId;
        params.functionObjId = undefined;
        $scope.unitObjId = unitObjId;
        $scope.functionObjId = undefined;

        $state.go($state.current, params, { reload: true }); //second parameter is for $stateParams
    }
});