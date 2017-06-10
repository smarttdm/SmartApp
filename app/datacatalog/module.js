"use strict";

angular.module("app.datacatalog", ["ui.router", "ui.bootstrap"]);

angular.module("app.datacatalog").config(function ($stateProvider, modalStateProvider) {

    $stateProvider
        .state('app.datacatalog', {
            url: '/datacatalog/:schema/:class/:edit/:delete/:insert/:search/:export/:import/:attachment/:hash',
            data: {
                title: 'data viewer'
            },
            views: {
                "content@app": {
                    templateUrl: "app/datacatalog/views/data-catalog-layout.html",
                    controller: 'DataCatalogLayoutCtrl'
                }
            },
            authenticate: true,
            resolve: {
                propmisedParams: function ($http, APP_CONFIG, $stateParams) {
                    return $http.get(APP_CONFIG.ebaasRootUrl + "/api/sitemap/parameters/" + $stateParams.hash)
                }
            }

        })
        .state('app.datacatalog.datatable', {
            url: '/datatable/:schema/:class/:node?view&tree&formtemplate',
            data: {
                title: 'Data Table'
            },
            views: {
                "datatable@app.datacatalog": {
                    controller: 'DataTableViewCtrl',
                    templateUrl: "app/datacatalog/views/data-table-view.html"
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
                }
            }
        })
        .state('app.datacatalog.datatable.processdata', {
            url: '/datacatalogprocessdata/:schema/:class/:oid/:xmlschema/:formAttribute',
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
        })
        .state('app.datacatalog.datatable.related', {
            url: '/datacatalogtablerelated/:schema/:class/:oid/:relatedclass/:exportrelated/:importrelated',
            data: {
                title: 'Related Grid',
                animation: false /* disable the content loading animation since $viewContentLoaded will not fire when opening modal */
            },
            views: {
                "content@app": {
                    controller: 'relatedDataGridCtrl',
                    templateUrl: "app/smarttables/views/related-datagrid.html"
                }
            },
            resolve: {
                promiseParentClassInfo: function ($http, APP_CONFIG, $stateParams) {
                    var url = APP_CONFIG.ebaasRootUrl + "/api/metadata/class/" + encodeURIComponent($stateParams.schema) + "/" + $stateParams.class;
                    return $http.get(url);
                }
            }
        });

        modalStateProvider.state('app.datacatalog.help', {
            url: '^/datacataloghelp/:hash',
            templateUrl: "app/layout/partials/help-viewer.tpl.html",
            controller: 'helpViewerCtlr',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.datacatalog.datatable.modalform', {
            url: '^/catalogmodalform/:schema/:class/:readonly/:oid/:template/:formAttribute/:duplicate/:cmd/:sref',
            templateUrl: "app/smartforms/views/ebaas-form-modal.html",
            controller: 'ebaasFormModalCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.datacatalog.datatable.modalform.pickpk', {
            url: '^/modalformpickpk/:pkclass/:property/:filter/:callback',
            templateUrl: "app/smartforms/views/pick-primary-key.html",
            controller: 'pickPrimaryKeyCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.datacatalog.datatable.modalform.viewmanytomany', {
            url: '^/modalformviewmanytomany/:masterclass/:relatedclass/:masterid',
            templateUrl: "app/smartforms/views/view-many-to-many.html",
            controller: 'viewManyToManyCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.datacatalog.datatable.modalform.uploadimage', {
            url: '^/modalformuploadimage/:property/:imageid',
            templateUrl: "app/smartforms/views/upload-image.html",
            controller: 'uploadImageCtrl',
            animation: false,
            size: 'md'
        });

        modalStateProvider.state('app.datacatalog.datatable.modalform.viewlog', {
            url: '^/modalformviewlog/:logschema/:logclass/:logoid/:logproperty',
            templateUrl: "app/logs/views/change-log-viewer.html",
            controller: 'changeLogViewerCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.datacatalog.datatable.attachments', {
            url: '^/catalogattachments/:schema/:class/:oid?readonly',
            templateUrl: "app/attachments/views/attachments-modal.html",
            controller: 'attachmentsModalCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.datacatalog.datatable.dataviewer', {
            url: '^/catalogdataviewer/:schema/:class/:oid/:xmlschema',
            templateUrl: "app/dataviewer/views/data-viewer-modal.html",
            controller: 'DataViewerModalCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.datacatalog.datatable.report', {
            url: '^/catalogreport/:schema/:class/:oid/:template/:templateAttribute/:fileType/:cmdHash',
            templateUrl: "app/smartreports/views/download-report.html",
            controller: 'downloadReportCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'sm'
        });

        modalStateProvider.state('app.datacatalog.datatable.datacart', {
            url: '^/catalogdatacart/:schema/:class',
            templateUrl: "app/datacart/views/data-cart.html",
            controller: 'dataCartCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.datacatalog.datatable.addtocart', {
            url: '^/catalogaddtocart/:schema/:class/:oid',
            templateUrl: "app/datacart/views/add-to-data-cart.html",
            controller: 'addToDataCartCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'sm'
        });

        modalStateProvider.state('app.datacatalog.datatable.filemanager', {
            url: '^/catalogfilemanager/:schema/:class/:oid/:cmdHash',
            templateUrl: "app/fileManager/views/file-manager-viewer.html",
            controller: 'fileManagerViewerCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.datacatalog.datatable.importdata', {
            url: '^/catalogtableimportdata/:schema/:class',
            templateUrl: "app/dataImporter/views/dataimport-view.html",
            controller: 'dataImportCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'md'
        });

        modalStateProvider.state('app.datacatalog.datatable.modalform.relatedform', {
            url: '^/catalogmodalrelatedform/:rclass/:roid/:rtemplate/:rformAttribute/:readonly',
            templateUrl: "app/smartforms/views/related-form-modal.html",
            controller: 'relatedFormModalCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.datacatalog.datatable.modalform.relatedform.pickpk', {
            url: '^/catalogmodalrelatedformpickpk/:pkclass/:property/:filter/:callback',
            templateUrl: "app/smartforms/views/pick-primary-key.html",
            controller: 'pickPrimaryKeyCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.datacatalog.datatable.modalform.relatedform.viewmanytomany', {
            url: '^/catalogmodalrelatedformviewmanytomany/:masterclass/:relatedclass/:masterid',
            templateUrl: "app/smartforms/views/view-many-to-many.html",
            controller: 'viewManyToManyCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.datacatalog.datatable.modalform.relatedform.uploadimage', {
            url: '^/catalogmodalrelatedformuploadimage/:property/:imageid',
            templateUrl: "app/smartforms/views/upload-image.html",
            controller: 'uploadImageCtrl',
            animation: false,
            size: 'md'
        });

        modalStateProvider.state('app.datacatalog.datatable.modalform.relatedform.viewlog', {
            url: '^/catalogmodalrelatedformviewlog/:logschema/:logclass/:logoid/:logproperty',
            templateUrl: "app/logs/views/change-log-viewer.html",
            controller: 'changeLogViewerCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.datacatalog.datatable.postview', {
            url: '^/catalogpostview/:schema/:class/:oid/:postClass?from&size&subject&content&url&urlparams',
            templateUrl: "app/taskforum/views/post-view.html",
            controller: 'PostViewCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.datacatalog.datatable.processdata.timeseries', {
            url: '^/catalogprocessdatatimeseries/:frequency/:ts',
            templateUrl: "app/dataviewer/views/time-series-modal.html",
            controller: 'TimeSeriesModalCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });
    });