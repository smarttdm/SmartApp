"use strict";

angular.module("app.forum", ["ui.router", "ui.bootstrap"]);

angular.module("app.forum").config(function ($stateProvider, modalStateProvider) {

    $stateProvider
        .state('app.forum', {
            url: '/forum/:schema/:class/:hash?pageIndex',
            data: {
                title: 'Forum',
                animation: false /* disable the content loading animation since $viewContentLoaded will not fire when opening modal */
            },
            views: {
                "content@app": {
                    templateUrl: "app/forum/views/forum-general.html",
                    controller: 'forumGeneralCtrl'
                }
            },
            authenticate: true,
            resolve: {
                promisedGroups: function ($http, APP_CONFIG, $stateParams) {
                    var pageSize = 30;
                    var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($stateParams.schema) + "/TopicGroup?view=full&size=" + pageSize;
                    if ($stateParams.pageIndex) {
                        var from = $stateParams.pageIndex * pageSize;
                        url += "&from=" + from;
                    }
   
                    return $http.get(url);
                }
            }
        })
        .state('app.forum.topics', {
            url: '/forumtopics/:schema/:class?pageIndex',
            params: { groupPK: null, groupId: null, category: null, groupName: null, keywords: null },
            data: {
                title: 'Topics'
            },
            views: {
                "content@app": {
                    templateUrl: "app/forum/views/forum-topics.html",
                    controller: 'forumTopicsCtrl'
                }
            }
        })
        .state('app.forum.topics.post', {
            url: '/forumpost/:schema/:class/:topicId?pageIndex',
            params: {groupId: null, topicName: null, topicPK: null },
            data: {
                title: 'Forum Post'
            },
            views: {
                "content@app": {
                    templateUrl: "app/forum/views/forum-post.html",
                    controller: 'forumPostCtrl'
                }
            },
            resolve: {
                scripts: function (lazyScript) {
                    return lazyScript.register([
                        'summernote',
                        'dropzone'
                    ]);
                }
            }
        });

        modalStateProvider.state('app.forum.help', {
            url: '^/forumhelp/:hash',
            templateUrl: "app/layout/partials/help-viewer.tpl.html",
            controller: 'helpViewerCtlr',
            animation: false,
            size: 'lg'
        });
    });