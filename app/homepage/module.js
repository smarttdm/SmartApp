"use strict";

angular.module("app.homepage", ["ui.router", "ui.bootstrap", "angular-carousel-3d"]);

angular.module("app.homepage").config(function ($stateProvider, modalStateProvider) {

    $stateProvider
        .state('app.homepage', {
            abstract: true,
            data: {
                title: 'Dashboard'
            }
        })
        .state('app.homepage.mainmenu', {
            url: '/home/mainmenu',
            data: {
                title: 'Main Menu'
            },
            views: {
                "content@app": {
                    templateUrl: "app/homepage/views/main-menu.html",
                    controller: "mainMenuCtrl"
                }
            },
            authenticate: true,
            resolve: {
                promisedMenuItems: function ($http, APP_CONFIG) {
                    return $http.get(APP_CONFIG.ebaasRootUrl + "/api/sitemap/menu")
                }
            }

        })
        .state('app.homepage.charts', {
            url: '/home/maincharts/:hash',
            data: {
                title: 'Main Charts',
                animation: false /* disable the content loading animation since $viewContentLoaded will not fire when opening modal */
            },
            views: {
                "content@app": {
                    templateUrl: "app/homepage/views/main-charts.html",
                    controller: "mainChartsCtrl"
                }
            },
            resolve: {
                promisedParams: function ($http, APP_CONFIG, $stateParams) {
                    return $http.get(APP_CONFIG.ebaasRootUrl + "/api/sitemap/parameters/" + $stateParams.hash)
                },
                scripts: function (lazyScript) {
                    return lazyScript.register([
                        'chartjs'
                    ]);
                }
            }

        })

        modalStateProvider.state('app.homepage.charts.help', {
            url: '^/chartshelp/:hash',
            templateUrl: "app/layout/partials/help-viewer.tpl.html",
            controller: 'helpViewerCtlr',
            animation: false,
            size: 'lg'
        });
    });