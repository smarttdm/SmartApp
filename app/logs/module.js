"use strict";

angular.module("app.logs", ["ui.router", "ui.bootstrap"]);

angular.module("app.logs").config(function ($stateProvider, modalStateProvider) {

    $stateProvider
        .state('app.logs', {
            url: '/changelogs/:logschema/:logclass/:logoid/:logproperty',
            data: {
                title: 'Change Log Viewer'
            },
            views: {
                "content@app": {
                    templateUrl: "app/logs/views/change-log-viewer.html"
                }
            }
        });
    });