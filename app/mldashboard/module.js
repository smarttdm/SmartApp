"use strict";

angular.module("app.mldashboard", ["ui.router", "ui.bootstrap"]);

angular.module("app.mldashboard").config(function ($stateProvider, modalStateProvider) {

    $stateProvider
        .state('app.mldashboard', {
            url: '/mldashboard/:hash',
            data: {
                title: 'ML Dashboard'
            },
            views: {
                "content@app": {
                    templateUrl: "app/mldashboard/views/ml-dashboard-layout.html",
                    controller: 'MLDashboardLayoutCtrl'
                }
            },
            authenticate: true,
            resolve: {
                propmisedParams: function ($http, APP_CONFIG, $stateParams) {
                    return $http.get(APP_CONFIG.ebaasRootUrl + "/api/sitemap/parameters/" + $stateParams.hash)
                }
            }

        })
        .state('app.mldashboard.modeldashboard', {
            url: '/modeldashboard/:project/:model',
            data: {
                title: 'Model Dashboard'
            },
            views: {
                "modeldashboard@app.mldashboard": {
                    controller: 'MLModelDashboardCtrl',
                    templateUrl: "app/mldashboard/views/ml-model-dashboard.html"
                }
            },
            authenticate: true,
            resolve: {
                scripts: function (lazyScript) {
                    return lazyScript.register(
                        [
                            'flot',
                            'flot-resize',
                            'flot-selection',
                            'flot-fillbetween',
                            'flot-orderBar',
                            'flot-pie',
                            'flot-time',
                            'flot-tooltip'
                        ])
                }
            }
        });

        modalStateProvider.state('app.mldashboard.help', {
            url: '^/mldashboardhelp/:hash',
            templateUrl: "app/layout/partials/help-viewer.tpl.html",
            controller: 'helpViewerCtlr',
            animation: false,
            size: 'lg'
        });
    });