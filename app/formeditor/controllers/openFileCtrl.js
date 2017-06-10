'use strict';

angular.module('app.formeditor').controller('openFileCtrl', function ($scope, $rootScope, APP_CONFIG, $stateParams, formEditorService) {

    $scope.dbschema = $stateParams.schema;
    formEditorService.contextModel.dbschema = $stateParams.schema;
    formEditorService.formInfo.formName = undefined;
    formEditorService.formInfo.classTitle = undefined;
    formEditorService.formInfo.dbclass = undefined;
    $scope.nodeType = "Folder";
    $scope.selectedVal = undefined;
    $scope.editorService = formEditorService;

    $scope.filenames = [];

    formEditorService.getClassTreeData($scope.dbschema, function (data) {
        $scope.treedata = data;
    });

    $scope.$watch('classes.currentNode', function (newObj, oldObj) {
        if ($scope.classes && angular.isObject($scope.classes.currentNode)) {
            if ($scope.classes.currentNode["type"] &&
                $scope.classes.currentNode["type"] === "Folder") {
                $scope.nodeType = "Folder";
                formEditorService.formInfo.dbclass = undefined;
                formEditorService.formInfo.classTitle = undefined;
                $scope.filenames = [];
                formEditorService.formInfo.formName = undefined;
            }
            else {
                formEditorService.getFormFiles($scope.dbschema, $scope.classes.currentNode.name, function (data) {
                    formEditorService.formInfo.dbclass = $scope.classes.currentNode.name;
                    formEditorService.formInfo.classTitle = $scope.classes.currentNode.title;
                    $scope.nodeType = "Class";
                    $scope.filenames = data;
                    formEditorService.contextModel.dbclass = formEditorService.formInfo.dbclass;
                    if ($scope.filenames && $scope.filenames.length > 0) {
                        $scope.selectedVal = $scope.filenames[0];
                        formEditorService.formInfo.formName = $scope.filenames[0];
                    }
                    else {
                        formEditorService.formInfo.formName = undefined;
                    }
                });
            }
        }
    }, false);

    $scope.selectFile = function()
    {
        formEditorService.formInfo.formName = $scope.selectedVal;
    }
});
