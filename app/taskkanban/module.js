"use strict";

angular.module("app.taskkanban", ["ui.router", "ui.bootstrap", "DlhSoft.Kanban.Angular.Components"]);

angular.module("app.taskkanban").config(function ($stateProvider, modalStateProvider) {

    $stateProvider
        .state('app.taskkanban', {
            abstract: true,
            data: {
                title: 'Task Kanban'
            }
        })
        .state('app.taskkanban.kanbanmain', {
            url: '/taskkanban/kanbanmain/:schema/:kanban/:hash?filter&pageIndex&objid',
            data: {
                title: 'Task Kanban',
                animation: false /* disable the content loading animation since $viewContentLoaded will not fire when opening modal */
            },
            views: {
                "content@app": {
                    templateUrl: 'app/taskkanban/views/kanban-main.html',
                    controller: 'KanbanMainCtrl'
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
                            'flot-tooltip',
                            'dropzone',
                            'summernote'
                        ])
                },
                kanbanModel: function ($http, APP_CONFIG, $stateParams) {
                    var pageSize = 5;
                    var paramsAdded = false;
                    var url = APP_CONFIG.ebaasRootUrl + "/api/kanban/data/" + encodeURIComponent($stateParams.schema) + "/" + encodeURIComponent($stateParams.kanban);

                    if ($stateParams.objid) {
                        url += "?objId=" + $stateParams.objid;
                        paramsAdded = true;
                    }
                    else if ($stateParams.filter) {
                        url += "?filter=" + $stateParams.filter;
                        paramsAdded = true;
                    }

                    if ($stateParams.pageIndex) {
                        var from = $stateParams.pageIndex * pageSize;
                        if (paramsAdded) {
                            url += "&from=" + from + "&size=" + pageSize;
                        }
                        else {
                            url += "?from=" + from + "&size=" + pageSize;
                        }
                    }
                    else {
                        var from = 0;
                        if (paramsAdded) {
                            url += "&from=" + from + "&size=" + pageSize;
                        }
                        else {
                            url += "?from=" + from + "&size=" + pageSize;
                        }
                    }

                    return $http.get(url);
                }
            }
        })
        .state('app.taskkanban.kanbanmain.processdata', {
            url: '/kanbanmainprocessdata/:schema/:class/:oid/:xmlschema/:formAttribute',
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

        modalStateProvider.state('app.taskkanban.kanbanmain.help', {
            url: '^/taskkanbanhelp/:hash',
            templateUrl: "app/layout/partials/help-viewer.tpl.html",
            controller: 'helpViewerCtlr',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.taskkanban.kanbanmain.modalform', {
            url: '^/kanbanmodalform/:schema/:class/:oid/:readonly/:template/:formAttribute',
            templateUrl: "app/smartforms/views/ebaas-form-modal.html",
            controller: 'ebaasFormModalCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg',
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
                            'flot-tooltip',
                            'dropzone'
                        ])
                }
            }
        });

        modalStateProvider.state('app.taskkanban.kanbanmain.dataviewer', {
            url: '^/kanbandataviewer/:schema/:class/:oid/:xmlschema',
            templateUrl: "app/dataviewer/views/data-viewer-modal.html",
            controller: 'DataViewerModalCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg',
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
                            'flot-tooltip',
                            'dropzone'
                        ])
                }
            }
        });

        modalStateProvider.state('app.taskkanban.kanbanmain.modalform.relatedform', {
            url: '^/kanbanrelatedform/:rclass/:roid/:rtemplate/:rformAttribute/:readonly',
            templateUrl: "app/smartforms/views/related-form-modal.html",
            controller: 'relatedFormModalCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.taskkanban.kanbanmain.modalform.pickpk', {
            url: '^/kanbanmodalformpickpk/:pkclass/:property/:filter/:callback',
            templateUrl: "app/smartforms/views/pick-primary-key.html",
            controller: 'pickPrimaryKeyCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.taskkanban.kanbanmain.modalform.viewmanytomany', {
            url: '^/kanbanmodalformviewmanytomany/:masterclass/:relatedclass/:masterid',
            templateUrl: "app/smartforms/views/view-many-to-many.html",
            controller: 'viewManyToManyCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.taskkanban.kanbanmain.modalform.uploadimage', {
            url: '^/kanbanmodalformuploadimage/:property/:imageid',
            templateUrl: "app/smartforms/views/upload-image.html",
            controller: 'uploadImageCtrl',
            animation: false,
            size: 'md'
        });

        modalStateProvider.state('app.taskkanban.kanbanmain.modalform.viewlog', {
            url: '^/kanbanmodalformviewlog/:logschema/:logclass/:logoid/:logproperty',
            templateUrl: "app/logs/views/change-log-viewer.html",
            controller: 'changeLogViewerCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.taskkanban.kanbanmain.filemanager', {
            url: '^/kanbanfilemanager/:schema/:class/:oid/:cmdHash',
            templateUrl: "app/fileManager/views/file-manager-viewer.html",
            controller: 'fileManagerViewerCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.taskkanban.kanbanmain.report', {
            url: '^/kanbanreport/:schema/:class/:oid/:template/:templateAttribute/:fileType/:cmdHash',
            templateUrl: "app/smartreports/views/download-report.html",
            controller: 'downloadReportCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'sm'
        });

        modalStateProvider.state('app.taskkanban.kanbanmain.postview', {
            url: '^/kanbanpostview/:schema/:class/:oid/:postClass?from&size&subject&content&url&urlparams',
            templateUrl: "app/taskforum/views/post-view.html",
            controller: 'PostViewCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });
    });