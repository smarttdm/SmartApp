'use strict';

angular.module('app.attachments').directive('fileDropzone', function ($rootScope) {
    return {
        restrict: 'A',
        compile: function (tElement, tAttributes) {
            tElement.removeAttr('smart-dropzone data-smart-dropzone');

            tElement.dropzone({
                addRemoveLinks : true,
                maxFilesize: 0.5,
                dictDefaultMessage: '<span class="text-center"><span class="font-lg visible-xs-block visible-sm-block visible-lg-block"><span class="font-lg"><i class="fa fa-caret-right text-danger"></i><span class="font-xs">' + $rootScope.getWord("DropZone") + '</span></span>',
                dictResponseError: $rootScope.getWord("UploadError")
            });
        }
    }
});
