"use strict";

angular.module("app.smartforms", ["ui.router", "ui.bootstrap"]);

angular.module("app.smartforms").config(function ($stateProvider, modalStateProvider) {

    $stateProvider
        .state('app.smartforms', {
            abstract: true,
            data: {
                title: 'Smart Forms'
            },
            resolve: {
                scripts: function (lazyScript) {
                    return lazyScript.register(
                    'dropzone',
                    'summernote')
                }
            }
        })
        .state('app.smartforms.ebaasform', {
            url: '/form/:schema/:class/:oid/:template/:formAttribute',
            data: {
                title: 'Ebaas Form',
                animation: false /* disable the content loading animation since $viewContentLoaded will not fire when opening modal */
            },
            views: {
                "content@app": {
                    controller: 'ebaasFormCtrl',
                    templateUrl: "app/smartforms/views/ebaas-form.html"
                }
            },
            resolve: {
                parentStateName : function($state)
                {
                    return undefined;
                }
            }
        });

        modalStateProvider.state('app.smartforms.ebaasform.modalform', {
            url: '^/formmodal/:class/:oid/:readonly/:formAttribute',
            templateUrl: "app/smartforms/views/ebaas-form-modal.html",
            controller: 'ebaasFormModalCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smartforms.ebaasform.relatedform', {
            url: '^/relatedform/:rclass/:roid/:rtemplate/:rformAttribute/:readonly',
            templateUrl: "app/smartforms/views/related-form-modal.html",
            controller: 'relatedFormModalCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smartforms.ebaasform.pickpk', {
            url: '^/formpickpk/:pkclass/:property/:filter/:callback',
            templateUrl: "app/smartforms/views/pick-primary-key.html",
            controller: 'pickPrimaryKeyCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smartforms.ebaasform.viewmanytomany', {
            url: '^/formviewmanytomany/:masterclass/:relatedclass/:masterid',
            templateUrl: "app/smartforms/views/view-many-to-many.html",
            controller: 'viewManyToManyCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smartforms.ebaasform.uploadimage', {
            url: '^/formuploadimage/:property/:imageid',
            templateUrl: "app/smartforms/views/upload-image.html",
            controller: 'uploadImageCtrl',
            animation: false,
            size: 'md'
        });

        modalStateProvider.state('app.smartforms.ebaasform.viewlog', {
            url: '^/formviewlog/:logschema/:logclass/:logoid/:logproperty',
            templateUrl: "app/logs/views/change-log-viewer.html",
            controller: 'changeLogViewerCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smartforms.ebaasform.report', {
            url: '^/formreport/:schema/:class/:oid/:template/:templateAttribute/:fileType/:cmdHash',
            templateUrl: "app/smartreports/views/download-report.html",
            controller: 'downloadReportCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'sm'
        });

        modalStateProvider.state('app.smartforms.ebaasform.filemanager', {
            url: '^/formfilemanager/:schema/:class/:oid/:cmdHash',
            templateUrl: "app/fileManager/views/file-manager-viewer.html",
            controller: 'fileManagerViewerCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

    });