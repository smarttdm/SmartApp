"use strict";

angular.module("app.filemanager", ["ui.router", "ui.bootstrap"]);

angular.module("app.filemanager").config(function ($stateProvider, modalStateProvider) {

    $stateProvider
        .state('app.filemanager', {
            url: '/filemanager/:schema/:class/:oid/:cmdHash',
            data: {
                title: 'Filemanager Viewer'
            },
            views: {
                "content@app": {
                    templateUrl: "app/filemanager/views/file-manager-viewer.html",
                    controller: "fileManagerViewerCtrl"
                }
            },
            resolve: {
                scripts: function(lazyScript){
                    return lazyScript.register('dropzone')
                }
            }
        });
    });