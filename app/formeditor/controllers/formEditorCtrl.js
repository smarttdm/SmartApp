'use strict';

angular.module('app.formeditor').controller('formEditorCtrl', function ($scope, $rootScope, $state, APP_CONFIG, $stateParams, formEditorService, $templateCache) {

    $scope.dbschema = $stateParams.schema;
    formEditorService.formInfo.dbclass = undefined;
    formEditorService.formInfo.classTitle = undefined;
    formEditorService.formInfo.formName = undefined;
    $scope.content =  $rootScope.getWord("Form Editor Tip");
    $scope.saved = false;
    $scope.previewId = 0;

    $scope.saveModel = function () {
        if (formEditorService.formInfo.dbclass && formEditorService.formInfo.formName) {
            formEditorService.saveFormFile($scope.dbschema, formEditorService.formInfo.dbclass, formEditorService.formInfo.formName, $scope.content, function () {
                BootstrapDialog.show({
                    title: $rootScope.getWord("Info Dialog"),
                    type: BootstrapDialog.TYPE_INFO,
                    message: $rootScope.getWord("Form Saved"),
                    buttons: [{
                        label: $rootScope.getWord("Cancel"),
                        action: function (dialog) {
                            dialog.close();
                        }
                    }]
                });
                $scope.saved = true;
            });
        }
        else
        {
            BootstrapDialog.show({
                title: $rootScope.getWord("Info Dialog"),
                type: BootstrapDialog.TYPE_INFO,
                message: $rootScope.getWord("Open Form First"),
                buttons: [{
                    label: $rootScope.getWord("Cancel"),
                    action: function (dialog) {
                        dialog.close();
                    }
                }]
            });
        }
    }

    $scope.previewForm = function () {
        if (formEditorService.formInfo.dbclass && formEditorService.formInfo.formName) {
            if ($scope.saved) {
                // previewId is used to prevent template caching, it has a different id each time
                $scope.previewId++;
                $state.go('.preview', { schema: $stateParams.schema, class: formEditorService.formInfo.dbclass, template: formEditorService.formInfo.formName + ".htm", previewid: $scope.previewId });
            }
            else
            {
                BootstrapDialog.show({
                    title: $rootScope.getWord("Info Dialog"),
                    type: BootstrapDialog.TYPE_INFO,
                    message: $rootScope.getWord("Save Form First"),
                    buttons: [{
                        label: $rootScope.getWord("Cancel"),
                        action: function (dialog) {
                            dialog.close();
                        }
                    }]
                });
            }
        }
        else
        {
            BootstrapDialog.show({
                title: $rootScope.getWord("Info Dialog"),
                type: BootstrapDialog.TYPE_INFO,
                message: $rootScope.getWord("Open Form First"),
                buttons: [{
                    label: $rootScope.getWord("Cancel"),
                    action: function (dialog) {
                        dialog.close();
                    }
                }]
            });
        }
    }

    $scope.loadForm = function()
    {
        if (formEditorService.formInfo.dbclass) {

            formEditorService.getFormFile($scope.dbschema, formEditorService.formInfo.dbclass, formEditorService.formInfo.formName, function (data) {
                $scope.content = data;
                if (data != "") {
                    $scope.saved = true; // allow preview an existing form
                }
            });
        }
        else
        {
            $scope.content = "";
            $scope.saved = false;
        }
    }

    $scope.getTitle = function()
    {
        var className = formEditorService.formInfo.classTitle;
        var formName = formEditorService.formInfo.formName;
        if (!className)
        {
            className = "None";
        }
        if (!formName)
        {
            formName = "None";
        }
        return String.format($rootScope.getWord("Form Info"), className, formName);
    }
});
