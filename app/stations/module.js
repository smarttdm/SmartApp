"use strict";

angular.module("app.stations", ["ui.router", "ui.bootstrap"]);

angular.module("app.stations").config(function ($stateProvider, modalStateProvider) {

    $stateProvider
        .state('app.stations', {
            url: '/stations/:schema/:class/:hash',
            data: {
                title: 'Stations',
                animation: false /* disable the content loading animation since $viewContentLoaded will not fire when opening modal */
            },
            views: {
                "content@app": {
                    templateUrl: "app/stations/views/stations-layout.html",
                    controller: 'StationsLayoutCtrl'
                }
            },
            resolve: {
                stationParams: function ($http, APP_CONFIG, $stateParams) {
                    return $http.get(APP_CONFIG.ebaasRootUrl + "/api/sitemap/parameters/" + $stateParams.hash);
                }
            }

        })
        .state('app.stations.dashboard', {
            url: '/stationdashboard/:schema/:class/:oid/:xmlschema/:index',
            data: {
                title: 'Station Dashboard',
                animation: false /* disable the content loading animation since $viewContentLoaded will not fire when opening modal */
            },
            views: {
                "dashboard@app.stations": {
                    controller: 'StationDashboardCtrl',
                    templateUrl: "app/stations/views/station-dashboard.html"
                }
            },
            authenticate: true,
            resolve: {
                scripts: function (lazyScript) {
                    return lazyScript.register([
                            'jquery-jvectormap-world-mill-en',
                            'flot-time',
                            'flot-resize'
                    ]);
                },
                promisedSettings: function ($http, APP_CONFIG, $stateParams) {
                    if ($stateParams.xmlschema) {
                        return $http.get(APP_CONFIG.ebaasRootUrl + "/api/data/extract/" + encodeURIComponent($stateParams.schema) + "/" + $stateParams.class + "/" + $stateParams.oid + "/" + $stateParams.xmlschema);
                    }
                    else
                    {
                        return undefined;
                    }
                }
            }
        });

        modalStateProvider.state('app.stations.help', {
            url: '^/stationshelp/:hash',
            templateUrl: "app/layout/partials/help-viewer.tpl.html",
            controller: 'helpViewerCtlr',
            animation: false,
            size: 'lg'
        });
    });