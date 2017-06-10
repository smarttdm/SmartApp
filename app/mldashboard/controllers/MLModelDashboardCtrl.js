'use strict';

angular.module('app.mldashboard').controller('MLModelDashboardCtrl', function ($controller, $rootScope, $scope, $http, APP_CONFIG, $state, $stateParams) {

    $scope.project = $stateParams.project;
    $scope.model = $stateParams.model;

    $scope.inputFields = [];
    $scope.outputFields = [];


    $scope.loading = false;
   
    // url to get model info
    var url = APP_CONFIG.ebaasRootUrl + "/api/dnn/model/" + $scope.project + "/" + $scope.model;

    $http.get(url).then(function (res) {
        $scope.modelInfo = res.data;

        var inputField, outputField;

        for (var i = 0; i < $scope.modelInfo.inputVariables.length; i += 1)
        {
            var inputVar = $scope.modelInfo.inputVariables[i];

            for (var j = 0; j < inputVar.dimension; j += 1)
            {
                inputField = {};
                inputField.Name = inputVar.name;
                inputField.Label = inputVar.name + "-" + j;
                inputField.DataType = inputVar.dataType;
                inputField.Value = "";

                $scope.inputFields.push(inputField);
            }
        }

        for (var i = 0; i < $scope.modelInfo.outputVariables.length; i += 1) {
            var outputVar = $scope.modelInfo.outputVariables[i];

            outputField = {};
            outputField.Label = outputVar.name;
            outputField.Name = outputVar.name;
            outputField.DataType = outputVar.dataType;
            outputField.Value = "";

            $scope.outputFields.push(outputField);
        }
    });

    $scope.submitModelForm = function()
    {
        $scope.loading = true;
        var features = GetFeatures();
        var labels = GetLabels();
  
        // url to get model info
        var url = APP_CONFIG.ebaasRootUrl + "/api/dnn/classify/" + $scope.project + "/" + $scope.model + "/" + features + "/" + labels;

        $http.get(url).then(function (res) {
            var outputs = res.data;

            for (var i = 0; i < $scope.outputFields.length; i += 1) {
                var outputField = $scope.outputFields[i];
                if (outputs[outputField.Name])
                {
                    outputField.Value = outputs[outputField.Name];
                }
            }

            $scope.loading = false;
        })
    }


    function GetFeatures()
    {
        var features = "";
        for (var i = 0; i < $scope.inputFields.length; i += 1) {
            var inputField = $scope.inputFields[i];
            if (inputField.Name == "features") {
                if (features)
                {
                    features += ";";
                }

                features += inputField.Value;
            }
        }

        return features;
    }

    function GetLabels() {
        var labels = "";
        for (var i = 0; i < $scope.inputFields.length; i += 1) {
            var inputField = $scope.inputFields[i];
            if (inputField.Name == "labels") {
                if (labels) {
                    labels += ";";
                }

                labels += inputField.Value;
            }
        }

        return labels;
    }
});