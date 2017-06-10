"use strict";

angular.module("app.smarttables", ["ngResource", "smart-table", "dx", "ui.router", "ui.bootstrap", "ui.bootstrap.modal", "ngProgress"]);

angular.module("app.smarttables")
    .provider('modalState', function ($stateProvider, $injector) {
        var provider = this;
        this.$get = function () {
            return provider;
        }
        this.state = function (stateName, options) {
            var modalInstance;
            $stateProvider.state(stateName, {
                url: options.url,
                data: {
                    title: 'Modal'
                },
                onEnter: function ($modal, $state, $injector) {
                    modalInstance = $modal.open(options);
                    modalInstance.result.then(function (data) {
                        // modal closed
                        var rScope = $injector.get('$rootScope');
                        rScope.$emit('modalClosed', data);

                    }, function () {
                        // modal dismissed
                        var rScope = $injector.get('$rootScope');
                        rScope.$emit('modalDismissed', "");
                    })['finally'](function () {
                        modalInstance = null;
                        if ($state.$current.name === stateName) {
                            $state.go('^', {}, {location:false, notify: false });
                        }
                    });
                },
                onExit: function () {
                    if (modalInstance) {
                        modalInstance.close();
                    }
                },
                resolve : options.resolve
            });
        };
    })
    .config(function ($stateProvider, modalStateProvider, $urlRouterProvider) {

        $stateProvider
            .state('app.smarttables', {
                abstract: true,
                data: {
                    title: 'Smart Tables'
                },
                resolve: {
                    scripts: function (lazyScript) {
                        return lazyScript.register('dropzone')
                    }
                }
            })
            .state('app.smarttables.datagrid', {
                url: '/datagrid/:schema/:class/:edit/:delete/:insert/:track/:export/:import/:cart/:search/:attachment/:hash',
                data: {
                    title: 'Smart Data Grid',
                    animation: false /* disable the content loading animation since $viewContentLoaded will not fire when opening modal */
                },
                authenticate: true,
                views: {
                    "content@app": {
                        controller: 'dataGridCtrl',
                        templateUrl: "app/smarttables/views/datagrid.html"
                    }
                },
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
                    propmisedParams: function ($http, APP_CONFIG, $stateParams) {
                        if ($stateParams.hash) {
                            return $http.get(APP_CONFIG.ebaasRootUrl + "/api/sitemap/parameters/" + $stateParams.hash);
                        }
                        else
                        {
                            return [];
                        }
                    }
                }
            })
            .state('app.smarttables.datagrid.processdata', {
                url: '/datagridprocessdata/:schema/:class/:oid/:xmlschema/:formAttribute',
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
            .state('app.smarttables.datagrid.related', {
                url: '/datagridrelated/:schema/:class/:oid/:relatedclass/:exportrelated/:importrelated',
                data: {
                    title: 'Smart Data Grid',
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
            })
            .state('app.smarttables.datagrid.requestwizard', {
                url: '/datagridrequestwizard/:schema/:class/:oid/:hash/:taskid',
                data: {
                    title: 'Request Wizard',
                    animation: false /* disable the content loading animation since $viewContentLoaded will not fire when opening modal */
                },
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
                    promiseInstance: function ($http, APP_CONFIG, $stateParams) {
                        if ($stateParams.oid) {
                            var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($stateParams.schema) + "/" + $stateParams.class + "/" + $stateParams.oid;
                            return $http.get(url);
                        }
                        else {
                            return undefined;
                        }
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
            .state('app.smarttables.datagrid.form', {
                url: '^/datagridform/:schema/:class/:oid/:template/:formAttribute',
                data: {
                    title: 'Smart Form',
                    animation: false /* disable the content loading animation since $viewContentLoaded will not fire when opening modal */
                },
                views: {
                    "content@app": {
                        controller: 'ebaasFormCtrl',
                        templateUrl: "app/smartforms/views/ebaas-form.html"
                    }
                },
                resolve: {
                    parentStateName: function ($state) {
                        return $state.current.name;
                    }
                }
            });

        modalStateProvider.state('app.smarttables.datagrid.help', {
            url: '^/datagridhelp/:hash',
            templateUrl: "app/layout/partials/help-viewer.tpl.html",
            controller: 'helpViewerCtlr',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.form.pickpk', {
            url: '^/datagridformpickpk/:pkclass/:property/:filter/:callback',
            templateUrl: "app/smartforms/views/pick-primary-key.html",
            controller: 'pickPrimaryKeyCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.form.viewmanytomany', {
            url: '^/datagridformviewmanytomany/:masterclass/:relatedclass/:masterid',
            templateUrl: "app/smartforms/views/view-many-to-many.html",
            controller: 'viewManyToManyCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.form.uploadimage', {
            url: '^/datagridformuploadimage/:property/:imageid',
            templateUrl: "app/smartforms/views/upload-image.html",
            controller: 'uploadImageCtrl',
            animation: false,
            size: 'md'
        });

        modalStateProvider.state('app.smarttables.datagrid.form.viewlog', {
            url: '^/datagridformviewlog/:logschema/:logclass/:logoid/:logproperty',
            templateUrl: "app/logs/views/change-log-viewer.html",
            controller: 'changeLogViewerCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.requestwizard.pickpk', {
            url: '^/datagridrequestwizardpickpk/:pkclass/:property/:filter/:callback',
            templateUrl: "app/smartforms/views/pick-primary-key.html",
            controller: 'pickPrimaryKeyCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.requestwizard.viewmanytomany', {
            url: '^/datagridrequestwizardviewmanytomany/:masterclass/:relatedclass/:masterid',
            templateUrl: "app/smartforms/views/view-many-to-many.html",
            controller: 'viewManyToManyCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.requestwizard.uploadimage', {
            url: '^/datagridrequestwizarduploadimage/:property/:imageid',
            templateUrl: "app/smartforms/views/upload-image.html",
            controller: 'uploadImageCtrl',
            animation: false,
            size: 'md'
        });

        modalStateProvider.state('app.smarttables.datagrid.requestwizard.viewlog', {
            url: '^/datagridrequestwizardviewlog/:logschema/:logclass/:logoid/:logproperty',
            templateUrl: "app/logs/views/change-log-viewer.html",
            controller: 'changeLogViewerCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.requestwizard.sampletree', {
            url: '^/datagridrequestwizardsampletree/',
            templateUrl: "app/wizards/views/sample-tree-modal.html",
            controller: 'sampleTreeModalCtrl',
            animation: false,
            size: 'sm'
        });

        modalStateProvider.state('app.smarttables.datagrid.requestwizard.itemtree', {
            url: '^/datagridrequestwizarditemtree/',
            templateUrl: "app/wizards/views/item-tree-modal.html",
            controller: 'itemTreeModalCtrl',
            animation: false,
            size: 'sm'
        });

        modalStateProvider.state('app.smarttables.datagrid.requestwizard.sampleform', {
            url: '^/datagridrequestwizardsampleform/:rclass/:rtemplate/:roid',
            templateUrl: "app/wizards/views/sample-form-modal.html",
            controller: 'sampleFormModalCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.requestwizard.sampleform.pickpk', {
            url: '^/datagridrequestwizardampleformpickpk/:pkclass/:property/:filter/:callback',
            templateUrl: "app/smartforms/views/pick-primary-key.html",
            controller: 'pickPrimaryKeyCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.requestwizard.sampleform.viewmanytomany', {
            url: '^/datagridrequestwizardsampleformviewmanytomany/:masterclass/:relatedclass/:masterid',
            templateUrl: "app/smartforms/views/view-many-to-many.html",
            controller: 'viewManyToManyCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.requestwizard.sampleform.uploadimage', {
            url: '^/datagridrequestwizardsampleformuploadimage/:property/:imageid',
            templateUrl: "app/smartforms/views/upload-image.html",
            controller: 'uploadImageCtrl',
            animation: false,
            size: 'md'
        });

        modalStateProvider.state('app.smarttables.datagrid.requestwizard.sampleform.viewlog', {
            url: '^/datagridrequestwizardsampleformviewlog/:logschema/:logclass/:logoid/:logproperty',
            templateUrl: "app/logs/views/change-log-viewer.html",
            controller: 'changeLogViewerCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.requestwizard.itemform', {
            url: '^/datagridrequestwizarditemform/:rclass/:rtemplate/:roid',
            templateUrl: "app/wizards/views/item-form-modal.html",
            controller: 'itemFormModalCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.requestwizard.itemform.pickpk', {
            url: '^/datagridrequestwizarditemformpickpk/:pkclass/:property/:filter/:callback',
            templateUrl: "app/smartforms/views/pick-primary-key.html",
            controller: 'pickPrimaryKeyCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.requestwizard.itemform.viewmanytomany', {
            url: '^/datagridrequestwizarditemformviewmanytomany/:masterclass/:relatedclass/:masterid',
            templateUrl: "app/smartforms/views/view-many-to-many.html",
            controller: 'viewManyToManyCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.requestwizard.itemform.uploadimage', {
            url: '^/datagridrequestwizarditemformuploadimage/:property/:imageid',
            templateUrl: "app/smartforms/views/upload-image.html",
            controller: 'uploadImageCtrl',
            animation: false,
            size: 'md'
        });

        modalStateProvider.state('app.smarttables.datagrid.requestwizard.itemform.viewlog', {
            url: '^/datagridrequestwizarditemformviewlog/:logschema/:logclass/:logoid/:logproperty',
            templateUrl: "app/logs/views/change-log-viewer.html",
            controller: 'changeLogViewerCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.requestwizard.relatedform', {
            url: '^/datagridrequestwizardrelatedform/:rclass/:roid/:rtemplate/:rformAttribute/:readonly',
            templateUrl: "app/smartforms/views/related-form-modal.html",
            controller: 'relatedFormModalCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.requestwizard.relatedform.pickpk', {
            url: '^/datagridrequestwizardrelatedformpickpk/:pkclass/:property/:filter/:callback',
            templateUrl: "app/smartforms/views/pick-primary-key.html",
            controller: 'pickPrimaryKeyCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.requestwizard.relatedform.viewmanytomany', {
            url: '^/datagridrequestwizardrelatedformviewmanytomany/:masterclass/:relatedclass/:masterid',
            templateUrl: "app/smartforms/views/view-many-to-many.html",
            controller: 'viewManyToManyCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.requestwizard.relatedform.uploadimage', {
            url: '^/datagridrequestwizardrelatedformuploadimage/:property/:imageid',
            templateUrl: "app/smartforms/views/upload-image.html",
            controller: 'uploadImageCtrl',
            animation: false,
            size: 'md'
        });

        modalStateProvider.state('app.smarttables.datagrid.requestwizard.relatedform.viewlog', {
            url: '^/datagridrequestwizardrelatedformviewlog/:logschema/:logclass/:logoid/:logproperty',
            templateUrl: "app/logs/views/change-log-viewer.html",
            controller: 'changeLogViewerCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.modalform', {
            url: '^/datagridmodalform/:schema/:class/:oid/:readonly/:template/:formAttribute/:duplicate/:cmd/:sref',
            templateUrl: "app/smartforms/views/ebaas-form-modal.html",
            controller: 'ebaasFormModalCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.attachments', {
            url: '^/datagridattachments/:schema/:class/:oid/:readonly',
            templateUrl: "app/attachments/views/attachments-modal.html",
            controller: 'attachmentsModalCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.modalform.relatedform', {
            url: '^/datagridrelatedform/:rclass/:roid/:rtemplate/:rformAttribute/:readonly',
            templateUrl: "app/smartforms/views/related-form-modal.html",
            controller: 'relatedFormModalCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.modalform.relatedform.pickpk', {
            url: '^/datagridmodalrelatedformpickpk/:pkclass/:property/:filter/:callback',
            templateUrl: "app/smartforms/views/pick-primary-key.html",
            controller: 'pickPrimaryKeyCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.modalform.relatedform.viewmanytomany', {
            url: '^/datagridmodalrelatedformviewmanytomany/:masterclass/:relatedclass/:masterid',
            templateUrl: "app/smartforms/views/view-many-to-many.html",
            controller: 'viewManyToManyCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.modalform.relatedform.uploadimage', {
            url: '^/datagridmodalrelatedformuploadimage/:property/:imageid',
            templateUrl: "app/smartforms/views/upload-image.html",
            controller: 'uploadImageCtrl',
            animation: false,
            size: 'md'
        });

        modalStateProvider.state('app.smarttables.datagrid.modalform.relatedform.viewlog', {
            url: '^/datagridmodalrelatedformviewlog/:logschema/:logclass/:logoid/:logproperty',
            templateUrl: "app/logs/views/change-log-viewer.html",
            controller: 'changeLogViewerCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.form.relatedform', {
            url: '^/datagridformrelatedform/:rclass/:roid/:rtemplate/:rformAttribute/:readonly',
            templateUrl: "app/smartforms/views/related-form-modal.html",
            controller: 'relatedFormModalCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.modalform.pickpk', {
            url: '^/datagridmodalformpickpk/:pkclass/:property/:filter/:callback',
            templateUrl: "app/smartforms/views/pick-primary-key.html",
            controller: 'pickPrimaryKeyCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.modalform.viewmanytomany', {
            url: '^/datagridmodalformviewmanytomany/:masterclass/:relatedclass/:masterid',
            templateUrl: "app/smartforms/views/view-many-to-many.html",
            controller: 'viewManyToManyCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.modalform.uploadimage', {
            url: '^/datagridmodalformuploadimage/:property/:imageid',
            templateUrl: "app/smartforms/views/upload-image.html",
            controller: 'uploadImageCtrl',
            animation: false,
            size: 'md'
        });

        modalStateProvider.state('app.smarttables.datagrid.modalform.viewlog', {
            url: '^/datagridmodalformviewlog/:logschema/:logclass/:logoid/:logproperty',
            templateUrl: "app/logs/views/change-log-viewer.html",
            controller: 'changeLogViewerCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.related.relatedform', {
            url: '^/relatedform/:schema/:rclass/:roid/:rtemplate/:rformAttribute/:readonly',
            templateUrl: "app/smartforms/views/related-form-modal.html",
            controller: 'relatedFormModalCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.related.relatedform.pickpk', {
            url: '^/datagridrelatedrelatedformpickpk/:pkclass/:property/:filter/:callback',
            templateUrl: "app/smartforms/views/pick-primary-key.html",
            controller: 'pickPrimaryKeyCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.related.relatedform.viewmanytomany', {
            url: '^/datagridrelatedrelatedformviewmanytomany/:masterclass/:relatedclass/:masterid',
            templateUrl: "app/smartforms/views/view-many-to-many.html",
            controller: 'viewManyToManyCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.related.relatedform.uploadimage', {
            url: '^/datagridrelatedrelatedformuploadimage/:property/:imageid',
            templateUrl: "app/smartforms/views/upload-image.html",
            controller: 'uploadImageCtrl',
            animation: false,
            size: 'md'
        });

        modalStateProvider.state('app.smarttables.datagrid.related.relatedform.viewlog', {
            url: '^/datagridrelatedrelatedformviewlog/:logschema/:logclass/:logoid/:logproperty',
            templateUrl: "app/logs/views/change-log-viewer.html",
            controller: 'changeLogViewerCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.related.attachments', {
            url: '^/relatedachments/:schema/:class/:oid?readonly',
            templateUrl: "app/attachments/views/attachments-modal.html",
            controller: 'attachmentsModalCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.report', {
            url: '^/datagridreport/:schema/:class/:oid/:template/:templateAttribute/:fileType/:cmdHash',
            templateUrl: "app/smartreports/views/download-report.html",
            controller: 'downloadReportCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'sm'
        });

        modalStateProvider.state('app.smarttables.datagrid.addtocart', {
            url: '^/datagridaddtocart/:schema/:class/:oid',
            templateUrl: "app/datacart/views/add-to-data-cart.html",
            controller: 'addToDataCartCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'sm'
        });

        modalStateProvider.state('app.smarttables.datagrid.related.importdata', {
            url: '^/datagridimportdata/:schema/:class/:oid/:relatedclass',
            templateUrl: "app/dataImporter/views/dataimport-view.html",
            controller: 'dataImportCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'md'
        });

        modalStateProvider.state('app.smarttables.datagrid.importdata', {
            url: '^/datagridrelatedimportdata/:schema/:class',
            templateUrl: "app/dataImporter/views/dataimport-view.html",
            controller: 'dataImportCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'md'
        });

        modalStateProvider.state('app.smarttables.datagrid.filemanager', {
            url: '^/datagridfilemanager/:schema/:class/:oid/:cmdHash',
            templateUrl: "app/fileManager/views/file-manager-viewer.html",
            controller: 'fileManagerViewerCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.datacart', {
            url: '^/datagriddatacart/:schema/:class',
            templateUrl: "app/datacart/views/data-cart.html",
            controller: 'dataCartCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.dataviewer', {
            url: '^/datagriddataviewer/:schema/:class/:oid/:xmlschema',
            templateUrl: "app/dataviewer/views/data-viewer-modal.html",
            controller: 'DataViewerModalCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.smarttables.datagrid.postview', {
            url: '^/datagridpostview/:schema/:class/:oid/:postClass?from&size&subject&content&url&urlparams',
            templateUrl: "app/taskforum/views/post-view.html",
            controller: 'PostViewCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });
    });