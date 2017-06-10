'use strict';

angular.module('app.userdirectory').controller('UserDirectoryLayoutCtrl', function ($http, APP_CONFIG, $scope, $rootScope, $state, $stateParams, userService, propmisedParams) {

    $scope.dbschema = $stateParams.schema;
    $scope.userclass = $stateParams.class;
    $scope.roleclass = "Role";

    // Getting unit tree
    $scope.unitObjId = $stateParams.unitObjId;

    var params = propmisedParams.data;

    $scope.view = params['dataView'];
    $scope.formTemplate = params['formTemplate'];

    userService.getUnitTree($stateParams.schema, $scope.roleclass, $scope.unitObjId, function (data) {
        $scope.unitTree = data;
    });

    // Getting function list
    userService.getFunctions($stateParams.schema, $scope.roleclass, function (data) {
        // add "Every One" as the first function
        var role = {};
        role.Text = $rootScope.getWord("Everyone");
        role.obj_id = undefined;
        if (data)
        {
            data.unshift(role);
        }
        else
        {
            data = [];
            data.push(role);
        }
 
        $scope.functions = data;
    });

    $state.go('app.userdirectory.usertable', { schema: $scope.dbschema, baseclass: $scope.roleclass, baseoid: undefined, relatedclass: $scope.userclass, view: $scope.view, formtemplate: $scope.formTemplate });

    $scope.functionObjId = undefined;
    
    $scope.getFunctionUsers = function (functionObjId) {
        $scope.functionObjId = functionObjId;
        $state.go('app.userdirectory.usertable', { schema: $scope.dbschema, baseclass: $scope.roleclass, baseoid: functionObjId, relatedclass: $scope.userclass, view: $scope.view, formtemplate: $scope.formTemplate });
    }

    $scope.getUnitUsers = function (unitObjId) {
        $scope.unitObjId = unitObjId;
        $state.go('app.userdirectory.usertable', { schema: $scope.dbschema, baseclass: $scope.roleclass, baseoid: unitObjId, relatedclass: $scope.userclass, view: $scope.view, formtemplate: $scope.formTemplate });
    }

    $scope.openFunctions = function () {
        $state.go('app.userdirectory.roletable', { schema: $scope.dbschema, baseclass: $scope.roleclass, roletype: "Function" });
    }

    $scope.openUnits = function () {
        $state.go('app.userdirectory.roletable', { schema: $scope.dbschema, baseclass: $scope.roleclass, roletype: "Unit" });
    }

    $scope.refresh = function () {
        $state.reload();
    }
});