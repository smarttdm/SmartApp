"use strict";

angular.module("app.wizards", ["ui.router", "ui.bootstrap"]);

angular.module("app.wizards").config(function ($stateProvider, modalStateProvider) {

    $stateProvider
        .state('app.wizards', {
            abstract: true,
            data: {
                title: 'Smart Wizards'
            }
        })
        .state('app.wizards.requestwizard', {
            url: '/requestwizard/:schema/:class/:hash',
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
            authenticate: true,
            resolve: {
                promiseParams: function ($http, APP_CONFIG, $stateParams) {
                    return $http.get(APP_CONFIG.ebaasRootUrl + "/api/sitemap/parameters/" + $stateParams.hash);
                },
                promiseInstance: function ($http, APP_CONFIG, $stateParams) {
                    if ($stateParams.oid) {
                        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($stateParams.schema) + "/" + $stateParams.class + "/" + $stateParams.oid;
                        return $http.get(url);
                    }
                    else
                    {
                        return undefined;
                    }
                },
                srcipts: function (lazyScript) {
                    return lazyScript.register([
                        'jquery-maskedinput',
                        'fuelux-wizard',
                        'jquery-validation',
                        'summernote',
                        'dropzone'
                    ])

                }
            }
        });

    modalStateProvider.state('app.wizards.requestwizard.help', {
        url: '^/requestwizardhelp/:hash',
        templateUrl: "app/layout/partials/help-viewer.tpl.html",
        controller: 'helpViewerCtlr',
        animation: false,
        size: 'lg'
    });

    modalStateProvider.state('app.wizards.requestwizard.relatedform', {
        url: '^/requestwizardrelatedform/:rclass/:roid/:rtemplate/:rformAttribute/:readonly',
        templateUrl: "app/smartforms/views/related-form-modal.html",
        controller: 'relatedFormModalCtrl',
        backdrop: 'static', /*  this prevent user interaction with the background  */
        keyboard: false,
        animation: false,
        size: 'lg'
    });

    modalStateProvider.state('app.wizards.requestwizard.relatedform.pickpk', {
        url: '^/requestwizardrelatedformpickpk/:pkclass/:property/:filter/:callback',
        templateUrl: "app/smartforms/views/pick-primary-key.html",
        controller: 'pickPrimaryKeyCtrl',
        animation: false,
        size: 'lg'
    });

    modalStateProvider.state('app.wizards.requestwizard.relatedform.viewmanytomany', {
        url: '^/requestwizardrelatedformviewmanytomany/:masterclass/:relatedclass/:masterid',
        templateUrl: "app/smartforms/views/view-many-to-many.html",
        controller: 'viewManyToManyCtrl',
        animation: false,
        size: 'lg'
    });

    modalStateProvider.state('app.wizards.requestwizard.relatedform.uploadimage', {
        url: '^/requestwizardrelatedformuploadimage/:property/:imageid',
        templateUrl: "app/smartforms/views/upload-image.html",
        controller: 'uploadImageCtrl',
        animation: false,
        size: 'md'
    });

    modalStateProvider.state('app.wizards.requestwizard.relatedform.viewlog', {
        url: '^/requestwizardrelatedformviewlog/:logschema/:logclass/:logoid/:logproperty',
        templateUrl: "app/logs/views/change-log-viewer.html",
        controller: 'changeLogViewerCtrl',
        animation: false,
        size: 'lg'
    });

    modalStateProvider.state('app.wizards.requestwizard.pickpk', {
        url: '^/requestwizardpickpk/:pkclass/:property/:filter/:callback',
        templateUrl: "app/smartforms/views/pick-primary-key.html",
        controller: 'pickPrimaryKeyCtrl',
        animation: false,
        size: 'lg'
    });

    modalStateProvider.state('app.wizards.requestwizard.viewmanytomany', {
        url: '^/requestwizardviewmanytomany/:masterclass/:relatedclass/:masterid',
        templateUrl: "app/smartforms/views/view-many-to-many.html",
        controller: 'viewManyToManyCtrl',
        animation: false,
        size: 'lg'
    });

    modalStateProvider.state('app.wizards.requestwizard.uploadimage', {
        url: '^/requestwizarduploadimage/:property/:imageid',
        templateUrl: "app/smartforms/views/upload-image.html",
        controller: 'uploadImageCtrl',
        animation: false,
        size: 'md'
    });

    modalStateProvider.state('app.wizards.requestwizard.viewlog', {
        url: '^/requestwizardviewlog/:logschema/:logclass/:logoid/:logproperty',
        templateUrl: "app/logs/views/change-log-viewer.html",
        controller: 'changeLogViewerCtrl',
        animation: false,
        size: 'lg'
    });

    modalStateProvider.state('app.wizards.requestwizard.sampleform', {
        url: '^/requestwizardsampleform/:rclass/:rtemplate/:roid',
        templateUrl: "app/wizards/views/sample-form-modal.html",
        controller: 'sampleFormModalCtrl',
        backdrop: 'static', /*  this prevent user interaction with the background  */
        keyboard: false,
        animation: false,
        size: 'lg'
    });

    modalStateProvider.state('app.wizards.requestwizard.sampleform.pickpk', {
        url: '^/requestwizardsampleformpickpk/:pkclass/:property/:filter/:callback',
        templateUrl: "app/smartforms/views/pick-primary-key.html",
        controller: 'pickPrimaryKeyCtrl',
        animation: false,
        size: 'lg'
    });

    modalStateProvider.state('app.wizards.requestwizard.sampleform.viewmanytomany', {
        url: '^/requestwizardsampleformviewmanytomany/:masterclass/:relatedclass/:masterid',
        templateUrl: "app/smartforms/views/view-many-to-many.html",
        controller: 'viewManyToManyCtrl',
        animation: false,
        size: 'lg'
    });

    modalStateProvider.state('app.wizards.requestwizard.sampleform.uploadimage', {
        url: '^/requestwizardsampleformuploadimage/:property/:imageid',
        templateUrl: "app/smartforms/views/upload-image.html",
        controller: 'uploadImageCtrl',
        animation: false,
        size: 'md'
    });

    modalStateProvider.state('app.wizards.requestwizard.sampleform.viewlog', {
        url: '^/requestwizardsampleformviewlog/:logschema/:logclass/:logoid/:logproperty',
        templateUrl: "app/logs/views/change-log-viewer.html",
        controller: 'changeLogViewerCtrl',
        animation: false,
        size: 'lg'
    });

    modalStateProvider.state('app.wizards.requestwizard.itemform', {
        url: '^/requestwizarditemform/:rclass/:rtemplate/:roid',
        templateUrl: "app/wizards/views/item-form-modal.html",
        controller: 'itemFormModalCtrl',
        backdrop: 'static', /*  this prevent user interaction with the background  */
        keyboard: false,
        animation: false,
        size: 'lg'
    });

    modalStateProvider.state('app.wizards.requestwizard.itemform.pickpk', {
        url: '^/requestwizarditemformpickpk/:pkclass/:property/:filter/:callback',
        templateUrl: "app/smartforms/views/pick-primary-key.html",
        controller: 'pickPrimaryKeyCtrl',
        animation: false,
        size: 'lg'
    });

    modalStateProvider.state('app.wizards.requestwizard.itemform.viewmanytomany', {
        url: '^/requestwizarditemformviewmanytomany/:masterclass/:relatedclass/:masterid',
        templateUrl: "app/smartforms/views/view-many-to-many.html",
        controller: 'viewManyToManyCtrl',
        animation: false,
        size: 'lg'
    });

    modalStateProvider.state('app.wizards.requestwizard.itemform.uploadimage', {
        url: '^/requestwizarditemformuploadimage/:property/:imageid',
        templateUrl: "app/smartforms/views/upload-image.html",
        controller: 'uploadImageCtrl',
        animation: false,
        size: 'md'
    });

    modalStateProvider.state('app.wizards.requestwizard.itemform.viewlog', {
        url: '^/requestwizarditemformviewlog/:logschema/:logclass/:logoid/:logproperty',
        templateUrl: "app/logs/views/change-log-viewer.html",
        controller: 'changeLogViewerCtrl',
        animation: false,
        size: 'lg'
    });

    modalStateProvider.state('app.wizards.requestwizard.sampletree', {
        url: '^/requestwizardsampletree/',
        templateUrl: "app/wizards/views/sample-tree-modal.html",
        controller: 'sampleTreeModalCtrl',
        animation: false,
        size: 'sm'
    });

    modalStateProvider.state('app.wizards.requestwizard.sampletree.form', {
        url: '^/requestwizardsampletreeform/:rclass/:rtemplate',
        templateUrl: "app/wizards/views/sample-form-modal.html",
        controller: 'sampleFormModalCtrl',
        backdrop: 'static', /*  this prevent user interaction with the background  */
        keyboard: false,
        animation: false,
        size: 'lg'
    });

    modalStateProvider.state('app.wizards.requestwizard.itemtree', {
        url: '^/requestwizarditemtree/',
        templateUrl: "app/wizards/views/item-tree-modal.html",
        controller: 'itemTreeModalCtrl',
        animation: false,
        size: 'sm'
    });

    modalStateProvider.state('app.wizards.requestwizard.itemtree.form', {
        url: '^/requestwizarditemtreeform/:rclass/:rtemplate/:tid',
        templateUrl: "app/wizards/views/item-new-form-modal.html",
        controller: 'itemNewFormModalCtrl',
        backdrop: 'static', /*  this prevent user interaction with the background  */
        keyboard: false,
        animation: false,
        size: 'lg'
    });
});