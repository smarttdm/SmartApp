"use strict";

angular.module("app.smartreports", ["ui.router", "ui.bootstrap"]);

angular.module("app.smartreports").config(function ($stateProvider) {

    $stateProvider
        .state('app.smartreports', {
            url: '/smartreports/:schema/:class/:oid/:xmlschema/:fileType/:cmdHash',
            data: {
                title: 'Smart Reports'
            },
            views: {
                "content@app": {
                    controller: 'downloadReportCtrl',
                    templateUrl: "app/smartreports/views/download-report.html"
                }
            }
        });
    });