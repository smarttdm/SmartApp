"use strict";

angular.module('app.myspace').controller('uploadPictureCtrl', function ($scope, $http, $stateParams, $modalInstance, APP_CONFIG, User, Upload, $timeout) {


    $scope.upload = function (dataUrl, name) {

        var fileName = User.userName + ".png";

        var uploadUrl = APP_CONFIG.ebaasRootUrl + "/api/images/avatars";

        Upload.upload({
            url: uploadUrl,
            data: {
                file: Upload.dataUrltoBlob(dataUrl, fileName)
            },
        }).then(function (response) {
            $timeout(function () {
                $scope.result = response.data;
                User.imageUrl = undefined;
                User.pictureChangeTime = new Date().getTime();

                if (!User.picture) {
                    User.picture = fileName;
    
                    User.save();
                }
            });
        }, function (response) {
            $scope.loading = false;
            if (response.status > 0) $scope.errorMsg = response.status
                + ': ' + response.data;
        }, function (evt) {

            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
        });
    };

    $scope.closeModal = function () {
        $modalInstance.dismiss("dismiss");

    };
});