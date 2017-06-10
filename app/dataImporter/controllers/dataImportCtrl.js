'use strict';

angular.module('app.dataImporter').controller('dataImportCtrl', function ($scope, $http, $stateParams, $modalInstance, APP_CONFIG, Upload) {

    $scope.dbschema = $stateParams.schema;
    $scope.dbclass = $stateParams.class;
    $scope.oid = $stateParams.oid;
    $scope.relatedclass = $stateParams.relatedclass;

    $scope.selectedScript = undefined;
    $scope.submitted = false;
    $scope.loading = false;

    var url;
    if (!$scope.relatedclass) {
        url = APP_CONFIG.ebaasRootUrl + "/api/import/scripts/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/All";
    }
    else
    {
        url = APP_CONFIG.ebaasRootUrl + "/api/import/scripts/" + encodeURIComponent($scope.dbschema) + "/" + $scope.relatedclass + "/All";
    }

    $http.get(url).success(function (data) {
        $scope.scripts = data.scripts;
    });

    // upload on file select or drop
    $scope.uploadFile = function (file) {
        $scope.loading = true;
        var uploadUrl;

        if ($scope.selectedScript.name === "Data Package") {
            uploadUrl = APP_CONFIG.ebaasRootUrl + "/api/import/datapackage/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass;
        }
        else {
            if (!$scope.relatedclass) {
                uploadUrl = APP_CONFIG.ebaasRootUrl + "/api/import/files/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + encodeURIComponent($scope.selectedScript.name);
            }
            else {
                uploadUrl = APP_CONFIG.ebaasRootUrl + "/api/import/files/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + $scope.oid + "/" + $scope.relatedclass + "/" + encodeURIComponent($scope.selectedScript.name);
            }
        }

        if ($scope.selectedScript) {
            
            Upload.upload({
                url: uploadUrl,
                data: { file: file }
            }).then(function (resp) {
                $scope.errorMsg = "";
                file.result = resp.data;
                $scope.loading = false;
                $scope.submitted = true;
                $scope.selectedScript = undefined;
                //console.log(resp);
            }, function (resp) {
                if (resp.status > 0)
                    $scope.errorMsg = resp.status + ': ' + resp.data.message;
                $scope.loading = false;
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                file.progress = progressPercentage;
            });
        }
    };

    $scope.selectFile = function()
    {
        var fileType = undefined
        if ($scope.file && $scope.file.name) {
            var extension = $scope.file.name.split('.').pop();
            if (extension) {
                switch (extension.toUpperCase()) {
                    case "XLS":
                    case "XLSX":
                        fileType = "Excel";
                        break;
                    case "TXT":
                    case "CSV":
                    case "DAT":

                        fileType = "Text";
                        break;
                    case "PAK":

                        fileType = "DataPackage";
                        break;
                    default:
                        fileType = "Other";
                        break;
                }

                var url;
                if (fileType != "DataPackage") {
                    if (!$scope.relatedclass) {
                        url = APP_CONFIG.ebaasRootUrl + "/api/import/scripts/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + fileType;
                    }
                    else {
                        url = APP_CONFIG.ebaasRootUrl + "/api/import/scripts/" + encodeURIComponent($scope.dbschema) + "/" + $scope.relatedclass + "/" + fileType;
                    }

                    $http.get(url).success(function (data) {
                        $scope.scripts = data.scripts;
                    });
                }
                else
                {
                    $scope.selectedScript = { name: "Data Package" };
                    $scope.scripts = [{ name: "Data Package" }];
                }
            }
        }
    }

    $scope.closeModal = function ()
    {
        if ($scope.submitted)
            $modalInstance.close("update");
        else
            $modalInstance.dismiss("dismiss");
    }
});