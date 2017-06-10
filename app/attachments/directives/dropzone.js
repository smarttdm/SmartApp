'use strict';

angular.module('app.attachments').directive('dropzone', function ($rootScope, APP_CONFIG, fileManager) {
    return {
        restrict: 'C',
        link: function (scope, element, attributes) {
            
            var config = {
                url: APP_CONFIG.ebaasRootUrl + "/" + fileManager.params.api + "/" + encodeURIComponent(fileManager.params.schema) + "/" + fileManager.params.cls + "/" + fileManager.params.oid + "?path=" + encodeURIComponent(fileManager.params.path),
                maxFilesize: 100,
                maxFiles: 20,
                maxThumbnailFilesize: 10,
                previewTemplate: '<div class="dz-preview dz-file-preview"><div><div class="dz-filename"><span data-dz-name></span></span></div><span class="fa fa-lg fa-file-text-o"></span></div><div><span class="dz-size" data-dz-size></div><div><span class="dz-upload" data-dz-uploadprogress></span></div><div class="dz-success-mark"><span class="fa fa-check"></span></div><div class="dz-error-mark"><span class="fa fa-exclamation-triangle"></span></div><div class="dz-error-message"><span data-dz-errormessage></span></div></div>',
                addRemoveLinks: false,
                paramName: "uploadFile",
                parallelUploads: 20,
                autoProcessQueue: false,
                dictDefaultMessage: '<span class="text-center"><span class="font-md visible-lg-block"><span class="font-md"><i class="fa fa-caret-right text-danger"></i><span class="font-xs">' + $rootScope.getWord("DropZone") + '</span></span>',
                dictResponseError: $rootScope.getWord("UploadError"),
                dictCancelUpload: "Cancel Upload",
                dictRemoveFile: "Remove File",

            };

            var eventHandlers = {
                'addedFile': function (file) {
                    scope.file = file;
                    if (this.files[1] != null) {
                        this.removeFile(this.files[0]);
                    }
                    scope.$apply(function () {
                        scope.fileAdded = true;
                    });
                },

                'success': function (file, response) {
                },

                'removedFile': function(file)
                {
                    console.debug("Removed file called");
                },

                'queuecomplete': function () {
                    fileManager.load();

                    setTimeout(function () {
                        //scope.resetDropzone();
                    }, 2000);
                }
            };

            var dropzone = new Dropzone(element[0], config);

            angular.forEach(eventHandlers, function (handler, event) {
                dropzone.on(event, handler);
            });

            scope.processDropzone = function () {

                var url = undefined;
                if (fileManager.params.oid)
                {
                    url = APP_CONFIG.ebaasRootUrl + "/" + fileManager.params.api + "/" + encodeURIComponent(fileManager.params.schema) + "/" + fileManager.params.cls + "/" + fileManager.params.oid + "?path=" + encodeURIComponent(fileManager.params.path);
                }

                dropzone.options.url = url;
                dropzone.processQueue();
            };

            scope.resetDropzone = function () {
                dropzone.removeAllFiles();
            }
        }
    }
});
