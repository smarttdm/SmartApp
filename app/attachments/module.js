"use strict";

angular.module("app.attachments", ["ui.router", "ui.bootstrap"]);

angular.module("app.attachments").config(function ($stateProvider, modalStateProvider) {

    $stateProvider
        .state('app.attachments', {
            url: '/attachmentviewer/:schema/:class/:oid',
            data: {
                title: 'Attachments Viewer'
            },
            views: {
                "content@app": {
                    templateUrl: "app/attachments/views/attachments-viewer.html"
                }
            },
            resolve: {
                scripts: function(lazyScript){
                    return lazyScript.register('dropzone')
                }
            }
        });
    });