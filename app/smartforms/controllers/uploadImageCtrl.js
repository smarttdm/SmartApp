"use strict";

angular.module('app.smartforms').controller('uploadImageCtrl', function ($scope, $http, $stateParams, $modalInstance, APP_CONFIG, Upload, $timeout) {

    $scope.isSubmitted = false;

    // upload on file select or drop
    $scope.uploadFile = function (file) {
        $scope.loading = true;

        var fileId = $stateParams.imageid;

        file = Upload.rename(file, fileId); // rename the file using image id

        var uploadUrl = APP_CONFIG.ebaasRootUrl + "/api/images/images";

        file.upload = Upload.upload({
            url: uploadUrl,
            data: {file: file },
        });

        file.upload.onAfterAddingFile = function (item) {
            var fileExtension = '.' + item.file.name.split('.').pop();

            console.debug(fileExtension);

            item.file.name = $stateParams.imageid;

            console.debug(item.file.name);
        };

        file.upload.then(function (resp) {
            $timeout(function () {
                file.result = resp.data;
                $scope.loading = false;
                $scope.isSubmitted = true;
            });
        }, function (resp) {
            if (resp.status > 0)
                $scope.errorMsg = resp.status + ': ' + resp.data.message;
            $scope.loading = false;
        }, function (evt) {
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
    };

    $scope.closeModal = function () {
        if ($scope.isSubmitted) {
            $modalInstance.close({ "modal": "uploadImage", "property": $stateParams.property, "value": $stateParams.imageid });
        }
        else {
            $modalInstance.dismiss("dismiss");
        }
    };
});