"use strict";

angular.module("app.bulletinboard", ["ui.router", "ui.bootstrap", "angular-carousel-3d"]);

angular.module("app.bulletinboard").config(function ($stateProvider, modalStateProvider) {

    $stateProvider
        .state('app.bulletinboard', {
            url: '/bulletinboard/:schema/:class/:hash',
            data: {
                title: 'Bulletin Board',
                animation: false /* disable the content loading animation since $viewContentLoaded will not fire when opening modal */
            },
            authenticate: true,
            views: {
                "content@app": {
                    controller: 'bulletinBoardCtrl',
                    templateUrl: "app/bulletinboard/views/bulletin-board.html"
                }
            }
        })
        .state('app.bulletinboard.post', {
            url: '/bulletinpost/:schema/:class/:oid',
            data: {
                title: 'Bulletin Post',
                animation: false /* disable the content loading animation since $viewContentLoaded will not fire when opening modal */
            },
            views: {
                "content@app": {
                    templateUrl: "app/bulletinboard/views/bulletin-post.html",
                    controller: 'bulletinPostCtrl'
                }
            },
            resolve: {
                promisedImages: function ($http, APP_CONFIG) {
                    return $http.get(APP_CONFIG.ebaasRootUrl + "/api/images/bulletin")
                },
                scripts: function (lazyScript) {
                    return lazyScript.register([
                        'summernote',
                        'dropzone'
                    ]);
                }
            }
        })
        .state('app.bulletinboard.view', {
            url: '/bulletinview/:schema/:class/:oid',
            data: {
                title: 'Bulletin View',
                animation: false /* disable the content loading animation since $viewContentLoaded will not fire when opening modal */
            },
            views: {
                "content@app": {
                    templateUrl: "app/bulletinboard/views/bulletin-view.html",
                    controller: 'bulletinViewCtrl'
                }
            }
        });

        modalStateProvider.state('app.bulletinboard.help', {
            url: '^/bulletinboardhelp/:hash',
            templateUrl: "app/layout/partials/help-viewer.tpl.html",
            controller: 'helpViewerCtlr',
            animation: false,
            size: 'lg'
        });
    });