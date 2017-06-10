"use strict";

angular.module("app.dataviewer", ["ui.router", "ui.bootstrap"]);

angular.module("app.dataviewer").config(function ($stateProvider, modalStateProvider) {

    $stateProvider
        .state('app.dataviewer', {
            url: '/dataviewer/:schema/:class/:oid/:xmlschema',
            data: {
                title: 'Data Viewer'
            },
            views: {
                "content@app": {
                    controller: 'DataViewerCtrl',
                    templateUrl: "app/dataviewer/views/data-viewer.html"
                }
            }
        });
    });