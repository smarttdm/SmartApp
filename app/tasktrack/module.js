"use strict";

angular.module("app.tasktrack", ["ui.router", "ui.bootstrap"]);

angular.module("app.tasktrack").config(function ($stateProvider, modalStateProvider) {

    $stateProvider
        .state('app.tasktrack', {
            abstract: true,
            data: {
                title: 'Task Track',
                animation: false /* disable the content loading animation since $viewContentLoaded will not fire when opening modal */
            }
        })
        .state('app.tasktrack.tasklist', {
            url: '/tasktrack/tasklist/:schema/:class/:hash/:pickoid',
            data: {
                title: 'Task List'
            },
            authenticate: true,
            views: {
                "content@app": {
                    templateUrl: 'app/tasktrack/views/task-list.html',
                    controller: 'TaskListCtrl'
                }
            }
        });

    modalStateProvider.state('app.tasktrack.tasklist.help', {
        url: '^/tasktracklisthelp/:hash',
        templateUrl: "app/layout/partials/help-viewer.tpl.html",
        controller: 'helpViewerCtlr',
        animation: false,
        size: 'lg'
    });

    modalStateProvider.state('app.tasktrack.tasklist.modalform', {
        url: '^/issuemodalform/:schema/:class/:oid/:readonly/:template/:formAttribute',
        templateUrl: "app/smartforms/views/ebaas-form-modal.html",
        controller: 'ebaasFormModalCtrl',
        backdrop: 'static', /*  this prevent user interaction with the background  */
        keyboard: false,
        animation: false,
        size: 'lg'
    });
});