"use strict";

angular.module("app.custom.tasktrack", ["ui.router", "ui.bootstrap"]);

angular.module("app.custom.tasktrack").config(function ($stateProvider, modalStateProvider) {

    $stateProvider
        .state('app.custom.tasktrack', {
            abstract: true,
            data: {
                title: 'Task Track',
            }
        })
        .state('app.custom.tasktrack.tasklist', {
            url: '/customtasktrack/tasklist/:schema/:class/:pickoid',
            data: {
                title: 'Task List',
            },
            views: {
                "content@app": {
                    templateUrl: 'custom/tasktrack/views/task-list.html',
                    controller: 'custom.TaskListCtrl'
                }
            }
        });

    modalStateProvider.state('app.custom.tasktrack.tasklist.modalform', {
        url: '^/issuemodalform/:schema/:class/:oid/:template/:formAttribute',
        templateUrl: "app/smartforms/views/ebaas-form-modal.html",
        controller: 'ebaasFormModalCtrl',
        backdrop: 'static', /*  this prevent user interaction with the background  */
        keyboard: false,
        animation: false,
        size: 'lg'
    });
});