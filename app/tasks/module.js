"use strict";

angular.module("app.tasks", ["ngResource", "ui.router", "ui.bootstrap", "ui.bootstrap.modal"]);

angular.module("app.tasks")
    .config(function ($stateProvider, modalStateProvider) {

        $stateProvider
            .state('app.tasks', {
                abstract: true,
                data: {
                    title: 'Tasks'
                }
            })
            .state('app.tasks.list', {
                url: '/tasks/list',
                authenticate: true,
                data: {
                    title: 'Tasks',
                    animation: false /* disable the content loading animation since $viewContentLoaded will not fire when opening modal */
                },
                views: {
                    "content@app": {
                        controller: 'taskListCtrl',
                        templateUrl: "app/tasks/views/task-list.html"
                    }
                },
                resolve: {
                    promiseTasks: function ($http, APP_CONFIG) {
                        return $http.get(APP_CONFIG.ebaasRootUrl + "/api/tasks/" + encodeURIComponent(APP_CONFIG.dbschema));
                    }
                }
            })
            .state('app.tasks.form', {
                url: '/tasks/form/:schema/:taskid',
                authenticate: true,
                data: {
                    title: 'Task Form',
                    animation: false /* disable the content loading animation since $viewContentLoaded will not fire when opening modal */
                },
                views: {
                    "content@app": {
                        controller: 'taskFormCtrl',
                        templateUrl: "app/tasks/views/task-form.html"
                    }
                },
                resolve: {
                    promiseTaskInfo: function ($http, APP_CONFIG, $stateParams) {
                        return $http.get(APP_CONFIG.ebaasRootUrl + "/api/tasks/" + encodeURIComponent($stateParams.schema) + "/" + $stateParams.taskid);
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
            })
            .state('app.tasks.form.requestwizard', {
                url: '/taskrequestwizard/:schema/:class/:template/:oid/:hash',
                data: {
                    title: 'Request Wizard',
                    animation: false /* disable the content loading animation since $viewContentLoaded will not fire when opening modal */
                },
                authenticate: true,
                views: {
                    "content@app": {
                        templateUrl: 'app/wizards/views/request-form-wizard.html',
                        controller: 'requestFormWizardCtrl'
                    }
                },
                resolve: {
                    promiseParams: function ($http, APP_CONFIG, $stateParams) {
                        return $http.get(APP_CONFIG.ebaasRootUrl + "/api/sitemap/parameters/" + $stateParams.hash)
                    },
                    srcipts: function (lazyScript) {
                        return lazyScript.register([
                            'jquery-maskedinput',
                            'fuelux-wizard',
                            'jquery-validation'
                        ])

                    }
                }
            })
            .state('app.tasks.form.processdata', {
                url: '/taskprocessdata/:schema/:class/:oid/:xmlschema/:formAttribute',
                data: {
                    title: 'Data Processing',
                    animation: false /* disable the content loading animation since $viewContentLoaded will not fire when opening modal */
                },
                views: {
                    "content@app": {
                        controller: 'DataViewerCtrl',
                        templateUrl: "app/dataviewer/views/data-viewer.html"
                    }
                }
            });

        modalStateProvider.state('app.tasks.form.modalform', {
            url: '^/taskformrelated/:class/:oid/:readonly/:formAttribute',
            templateUrl: "app/smartforms/views/ebaas-form-modal.html",
            controller: 'ebaasFormModalCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.tasks.form.relatedform', {
            url: '^/taskrelatedform/:rclass/:roid/:rtemplate/:rformAttribute/:readonly',
            templateUrl: "app/smartforms/views/related-form-modal.html",
            controller: 'relatedFormModalCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.tasks.form.relatedform.pickpk', {
            url: '^/taskrelatedformpickpk/:pkclass/:property/:filter/:callback',
            templateUrl: "app/smartforms/views/pick-primary-key.html",
            controller: 'pickPrimaryKeyCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.tasks.form.relatedform.viewmanytomany', {
            url: '^/taskrelatedformviewmanytomany/:masterclass/:relatedclass/:masterid',
            templateUrl: "app/smartforms/views/view-many-to-many.html",
            controller: 'viewManyToManyCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.tasks.form.relatedform.uploadimage', {
            url: '^/taskrelatedformuploadimage/:property/:imageid',
            templateUrl: "app/smartforms/views/upload-image.html",
            controller: 'uploadImageCtrl',
            animation: false,
            size: 'md'
        });

        modalStateProvider.state('app.tasks.form.relatedform.viewlog', {
            url: '^/taskrelatedformviewlog/:logschema/:logclass/:logoid/:logproperty',
            templateUrl: "app/logs/views/change-log-viewer.html",
            controller: 'changeLogViewerCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.tasks.form.pickpk', {
            url: '^/taskformpickpk/:pkclass/:property/:filter/:callback',
            templateUrl: "app/smartforms/views/pick-primary-key.html",
            controller: 'pickPrimaryKeyCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.tasks.form.viewmanytomany', {
            url: '^/taskformviewmanytomany/:masterclass/:relatedclass/:masterid',
            templateUrl: "app/smartforms/views/view-many-to-many.html",
            controller: 'viewManyToManyCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.tasks.form.uploadimage', {
            url: '^/taskformuploadimage/:property/:imageid',
            templateUrl: "app/smartforms/views/upload-image.html",
            controller: 'uploadImageCtrl',
            animation: false,
            size: 'md'
        });

        modalStateProvider.state('app.tasks.form.viewlog', {
            url: '^/taskformviewlog/:logschema/:logclass/:logoid/:logproperty',
            templateUrl: "app/logs/views/change-log-viewer.html",
            controller: 'changeLogViewerCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.tasks.form.dataviewer', {
            url: '^/taskformdataviewer/:schema/:class/:oid/:xmlschema',
            templateUrl: "app/dataviewer/views/data-viewer-modal.html",
            controller: 'DataViewerModalCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.tasks.form.report', {
            url: '^/taskformreport/:schema/:class/:oid/:template/:templateAttribute/:fileType/:cmdHash',
            templateUrl: "app/smartreports/views/download-report.html",
            controller: 'downloadReportCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'sm'
        });

        modalStateProvider.state('app.tasks.form.filemanager', {
            url: '^/taskformfilemanager/:schema/:class/:oid/:cmdHash',
            templateUrl: "app/fileManager/views/file-manager-viewer.html",
            controller: 'fileManagerViewerCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.tasks.list.reassign', {
            url: '^/reassigntask/:schema/:taskid',
            templateUrl: "app/tasks/views/reassign-task.html",
            controller: 'reassignTaskCtrl',
            animation: false,
            size: 'sm'
        });

        modalStateProvider.state('app.tasks.list.substitute', {
            url: '^/tasksubstitute/:schema',
            templateUrl: "app/tasks/views/task-substitute.html",
            controller: 'taskSubstituteCtrl',
            animation: false,
            size: 'md'
        });
    });