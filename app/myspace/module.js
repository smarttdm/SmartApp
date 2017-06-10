"use strict";

angular.module("app.myspace", ["ui.router", "ui.bootstrap", "superbox", 'ngFileUpload', 'ngImgCrop']);

angular.module("app.myspace").config(function ($stateProvider, modalStateProvider) {

    $stateProvider
        .state('app.myspace', {
            url: '/myspace/:schema/:hash',
            data: {
                title: 'My Space',
                animation: false /* disable the content loading animation since $viewContentLoaded will not fire when opening modal */
            },
            views: {
                "content@app": {
                    templateUrl: "app/myspace/views/my-space.html",
                    controller: 'mySpaceCtrl'
                }
            },
            authenticate: true,
            resolve: {
                promiseTasks: function ($http, APP_CONFIG, $stateParams) {
                    return $http.get(APP_CONFIG.ebaasRootUrl + "/api/tasks/" + encodeURIComponent($stateParams.schema));
                }
            }
        })
        .state('app.myspace.finished', {
            url: '/myspace/form/:schema/:taskid',
            authenticate: true,
            data: {
                title: 'Finished Task Form',
                animation: false /* disable the content loading animation since $viewContentLoaded will not fire when opening modal */
            },
            views: {
                "content@app": {
                    controller: 'finishedTaskFormCtrl',
                    templateUrl: "app/myspace/views/finished-task-form.html"
                }
            },
            resolve: {
                promiseFinishedTaskInfo: function ($http, APP_CONFIG, $stateParams) {
                    return $http.get(APP_CONFIG.ebaasRootUrl + "/api/tasks/finished/" + encodeURIComponent($stateParams.schema) + "/" + $stateParams.taskid);
                },
                srcipts: function (lazyScript) {
                    return lazyScript.register(
                       [
                        'flot',
                        'flot-resize',
                        'flot-selection',
                        'flot-fillbetween',
                        'flot-orderBar',
                        'flot-pie',
                        'flot-time',
                        'flot-tooltip',
                        'dropzone'
                       ]
                        )
                }
            }
        });

        modalStateProvider.state('app.myspace.help', {
            url: '^/myspacehelp/:hash',
            templateUrl: "app/layout/partials/help-viewer.tpl.html",
            controller: 'helpViewerCtlr',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.myspace.uploadpicture', {
            url: '^/myspaceuploadpic',
            templateUrl: "app/myspace/views/upload-picture.html",
            controller: 'uploadPictureCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.myspace.reassign', {
            url: '^/myspacereassigntask/:schema/:taskid',
            templateUrl: "app/tasks/views/reassign-task.html",
            controller: 'reassignTaskCtrl',
            animation: false,
            size: 'sm'
        });

        modalStateProvider.state('app.myspace.substitute', {
            url: '^/myspacetasksubstitute/:schema',
            templateUrl: "app/tasks/views/task-substitute.html",
            controller: 'taskSubstituteCtrl',
            animation: false,
            size: 'md'
        });
    });