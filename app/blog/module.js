"use strict";

angular.module("app.blog", ["ui.router", "ui.bootstrap"]);

angular.module("app.blog").config(function ($stateProvider, modalStateProvider) {

    $stateProvider
        .state('app.blog', {
            url: '/blog/:schema/:class/:groupId/:hash?pageIndex&groupName',
            data: {
                title: 'Blog',
                animation: false /* disable the content loading animation since $viewContentLoaded will not fire when opening modal */
            },
            views: {
                "content@app": {
                    templateUrl: "app/blog/views/blog-general.html",
                    controller: 'blogGeneralCtrl'
                }
            },
            authenticate: true
        })
        .state('app.blog.post', {
            url: '/blogpost/:schema/:blogclass/:oid',
            data: {
                title: 'Blog Post'
            },
            views: {
                "content@app": {
                    templateUrl: "app/blog/views/blog-post.html",
                    controller: 'blogPostCtrl'
                }
            },
            resolve: {
                scripts: function (lazyScript) {
                    return lazyScript.register([
                        'summernote',
                        'dropzone'
                    ]);
                },
                promisedImages: function ($http, APP_CONFIG) {
                    return $http.get(APP_CONFIG.ebaasRootUrl + "/api/images/blogs")
                },
                promisedGroups: function ($http, APP_CONFIG, $stateParams) {
                    var pageSize = 100;
                    var url = APP_CONFIG.ebaasRootUrl + "/api/data/COMMON/BlogGroup?view=full&size=" + pageSize;
                    return $http.get(url);
                }
            }
        })
        .state('app.blog.view', {
            url: '/blogview/:schema/:blogclass/:oid',
            data: {
                title: 'Blog View'
            },
            views: {
                "content@app": {
                    templateUrl: "app/blog/views/blog-view.html",
                    controller: 'blogViewCtrl'
                }
            }
        });

        modalStateProvider.state('app.blog.help', {
            url: '^/bloghelp/:hash',
            templateUrl: "app/layout/partials/help-viewer.tpl.html",
            controller: 'helpViewerCtlr',
            animation: false,
            size: 'lg'
        });
    });