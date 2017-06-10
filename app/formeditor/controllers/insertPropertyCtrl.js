'use strict';

angular.module('app.formeditor').controller('insertPropertyCtrl', function ($scope, $rootScope, APP_CONFIG, $stateParams, formEditorService) {

    $scope.Initialize = function () {
        $scope.properties = [];
        $scope.leafClasses = [];
        $scope.isReadOnly = false;
        $scope.includeLabel = true;
        $scope.selectedClass = undefined;
        $scope.selectedProperty = undefined;

        formEditorService.getRelationshipTreeData(formEditorService.contextModel.dbschema, formEditorService.contextModel.dbclass, function (data) {
            var roots = [];
            roots.push(data);
            $scope.treedata = roots;

            formEditorService.getClassProperties(formEditorService.contextModel.dbschema, formEditorService.contextModel.dbclass, function (data) {
                $scope.selectedClass = formEditorService.contextModel.dbclass;
                $scope.properties = getProperties(data);
            });
        });
    };

    $scope.Initialize();

    $scope.reInitialize = function()
    {
        if ($scope.selectedClass &&
            $scope.selectedClass != formEditorService.contextModel.dbclass)
        {
            $scope.Initialize();
        }
    }

    $scope.$watch('classes.currentNode', function (newObj, oldObj) {
        if ($scope.classes && angular.isObject($scope.classes.currentNode)) {
            formEditorService.getClassProperties(formEditorService.contextModel.dbschema, $scope.classes.currentNode.name, function (data) {
                $scope.properties = getProperties(data);
                $scope.selectedClass = $scope.classes.currentNode.name;
                if (!$scope.classes.currentNode.leaf)
                {
                    formEditorService.getLeafClasses(formEditorService.contextModel.dbschema, $scope.classes.currentNode.name, function (data) {
                        $scope.leafClasses = data;
                    });
                }
                else
                {
                    $scope.leafClasses = [];
                }
            });
        }
    }, false);

    $scope.selectLeafClass = function()
    {
        if ($scope.selectedLeafClass) {
            formEditorService.getClassProperties(formEditorService.contextModel.dbschema, $scope.selectedLeafClass.name, function (data) {
                $scope.properties = getProperties(data);
                $scope.selectedClass = $scope.selectedLeafClass.name;
            });
        }
    }

    $scope.selectProperty = function () {
        $scope.isReadOnly = false;
        $scope.selectedProperty = $scope.selectedClassProperty;
    }

    $scope.getFieldElement = function()
    {
        if (!$scope.selectedProperty)
        {
            return undefined;
        }
        else
        {
            var html = '<div class="form-group">';
            if ($scope.includeLabel)
            {
                html += '<label>' + $scope.selectedProperty.label + '</label>';
            }
            html +=  '<input class="form-control" name="' + $scope.selectedClass + '_' + $scope.selectedProperty.name + '"';
            if ($scope.isReadOnly)
            {
                html += ' read="true"';
            }
            html += '/></div>';

            return html;
        }
    }

    var getProperties = function(data)
    {
        var column;
        var columns = [];

        // data is a JSON Schema for the class
        var properties = data.properties; // data.properies contains infos of each property of the schema

        var propertyInfo;
        for (var property in properties) {
            if (properties.hasOwnProperty(property)) {
                propertyInfo = properties[property];
                column = {};
                column.name = property;
                column.label = propertyInfo["title"];
                if (!propertyInfo["description"])
                    column.title = propertyInfo["title"];
                else
                    column.title = propertyInfo["title"] + " (" + propertyInfo["description"] + ")";
                columns.push(column);
            }
        }

        return columns;
    }
});
