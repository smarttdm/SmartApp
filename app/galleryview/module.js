"use strict";

angular.module("app.galleryview", ["ui.router", "ui.bootstrap", "superbox"]);

angular.module("app.galleryview").config(function ($stateProvider, modalStateProvider) {

    $stateProvider
        .state('app.galleryview', {
            url: '/galleryview/:schema/:class/:hash?pageIndex',
            data: {
                title: 'Gallery View',
                animation: false /* disable the content loading animation since $viewContentLoaded will not fire when opening modal */
            },
            views: {
                "content@app": {
                    templateUrl: "app/galleryview/views/gallery-view.html",
                    controller: 'galleryViewCtrl'
                }
            },
            authenticate: true,
            resolve: {
                promiseParams: function ($http, APP_CONFIG, $stateParams) {
                    return $http.get(APP_CONFIG.ebaasRootUrl + "/api/sitemap/parameters/" + $stateParams.hash)
                },
                promiseClassInfo: function ($http, APP_CONFIG, $stateParams) {
                    var url = APP_CONFIG.ebaasRootUrl + "/api/metadata/class/" + encodeURIComponent($stateParams.schema) + "/" + $stateParams.class;
                    return $http.get(url);
                },
                promiseItems: function ($http, APP_CONFIG, $stateParams) {
                    var pageSize = 24;
                    var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($stateParams.schema) + "/" + $stateParams.class + "?view=full&size=" + pageSize;
                    if ($stateParams.pageIndex) {
                        var from = $stateParams.pageIndex * pageSize;
                        url += "&from=" + from;
                    }
                    return $http.get(url);
                },
                promisedCommands: function ($http, APP_CONFIG, $stateParams) {
                    var url = APP_CONFIG.ebaasRootUrl + "/api/sitemap/commands/" + encodeURIComponent($stateParams.schema) + "/" + $stateParams.class;
                    return $http.get(url);
                }
            }
        });

        modalStateProvider.state('app.galleryview.related.relatedform', {
            url: '^/galleryrelatedform/:schema/:rclass/:roid/:rtemplate/:readonly',
            templateUrl: "app/smartforms/views/related-form-modal.html",
            controller: 'relatedFormModalCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });
    });