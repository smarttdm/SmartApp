"use strict";

angular.module("app.taskforum", ["ui.router", "ui.bootstrap", "summernote"]);

angular.module("app.taskforum").config(function ($stateProvider, modalStateProvider) {

    $stateProvider
        .state('app.taskforum', {
            abstract: true,
            data: {
                title: 'Task Forum'
            }
        })
        .state('app.taskforum.postview', {
            url: '/taskforum/postview/:schema/:class/:oid/:postClass?from&size&subject&content&url&urlparams',
            data: {
                title: 'Post View'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/taskforum/views/post-view.html',
                    controller: 'PostViewCtrl',
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
});