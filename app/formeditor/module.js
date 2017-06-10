"use strict";

angular.module("app.formeditor", ["ui.router", "ui.bootstrap", "angularTreeview"]);

angular.module("app.formeditor").config(function ($stateProvider, modalStateProvider) {

    $stateProvider
        .state('app.formeditor', {
            url: '/formeditor/:schema/:hash',
            data: {
                title: 'Form Editor',
                animation: false /* disable the content loading animation since $viewContentLoaded will not fire when opening modal */
            },
            views: {
                "content@app": {
                    controller: 'formEditorCtrl',
                    templateUrl: "app/formeditor/views/form-editor.html"
                }
            },
            resolve: {
                scripts: function(lazyScript){
                    return lazyScript.register([
                        'ckeditor',
                        'dropzone',
                        'summernote'
                    ])
                }
            }
        });

        modalStateProvider.state('app.formeditor.help', {
            url: '^/formeditorhelp/:hash',
            templateUrl: "app/layout/partials/help-viewer.tpl.html",
            controller: 'helpViewerCtlr',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.formeditor.preview', {
            url: '^/formpreview/:schema/:class/:template/:previewid',
            templateUrl: "app/smartforms/views/ebaas-form-modal.html",
            controller: 'ebaasFormModalCtrl',
            backdrop: 'static', /*  this prevent user interaction with the background  */
            keyboard: false,
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.formeditor.preview.pickpk', {
            url: '^/previewpickpk/:pkclass/:property/:filter/:callback',
            templateUrl: "app/smartforms/views/pick-primary-key.html",
            controller: 'pickPrimaryKeyCtrl',
            animation: false,
            size: 'lg'
        });

        modalStateProvider.state('app.formeditor.preview.viewmanytomany', {
            url: '^/previewviewmanytomany/:masterclass/:relatedclass/:masterid',
            templateUrl: "app/smartforms/views/view-many-to-many.html",
            controller: 'viewManyToManyCtrl',
            animation: false,
            size: 'lg'
        });
    });