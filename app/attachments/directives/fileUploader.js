'use strict';

angular.module('app.attachments').directive('egFileUploader', function (loadingInfo, fileManager) {

    var directive = {
        link: link,
        restrict: 'E',
        templateUrl: 'app/attachments/views/fileUploader.html',
        scope: true
    };
    return directive;

    function link(scope, element, attrs) {
        scope.hasFiles = false;
        scope.files = [];
        scope.upload = fileManager.upload;
        scope.appStatus = loadingInfo.status;
        scope.fileManagerStatus = fileManager.status;
    }

});