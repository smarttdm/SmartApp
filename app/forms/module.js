"use strict";


angular.module('app.forms', ['ui.router'])


angular.module('app.forms').config(function ($stateProvider) {

    $stateProvider
        .state('app.form', {
            abstract: true,
            data: {
                title: 'Forms'
            }
        })

        .state('app.form.elements', {
            url: '/form/elements',
            data: {
                title: 'Form Elements'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/forms/views/form-elements.html'
                }
            }
        })

        .state('app.form.layouts', {
            url: '/form/layouts',
            data: {
                title: 'Form Layouts'
            },
            views: {
                "content@app": {
                    controller: 'FormLayoutsCtrl',
                    templateUrl: 'app/forms/views/form-layouts/form-layouts-demo.html'
                }
            }
        })

        .state('app.form.validation', {
            url: '/form/validation',
            data: {
                title: 'Form Validation'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/forms/views/form-validation.html'
                }
            }
        })

        .state('app.form.bootstrapForms', {
            url: '/form/bootstrap-forms',
            data: {
                title: 'Bootstrap Forms'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/forms/views/bootstrap-forms.html'
                }
            }
        })

        .state('app.form.bootstrapValidation', {
            url: '/form/bootstrap-validation',
            data: {
                title: 'Bootstrap Validation'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/forms/views/bootstrap-validation.html'
                }
            },
            resolve: {
                srcipts: function(lazyScript){
                    return lazyScript.register([
                        'bootstrap-validator'
                    ])

                }
            }
        })

        .state('app.form.plugins', {
            url: '/form/plugins',
            data: {
                title: 'Form Plugins'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/forms/views/form-plugins.html',
                    controller: 'FormPluginsCtrl'
                }
            },
            resolve: {
                srcipts: function(lazyScript){
                    return lazyScript.register([
                        'bootstrap-duallistbox',
                        'bootstrap-timepicker',
                        'clockpicker',
                        'bootstrap-colorpicker',
                        'bootstrap-tagsinput',
                        'jquery-maskedinput',
                        'jquery-knob',
                        'x-editable'
                    ])

                }
            }
        })
        .state('app.form.wizards', {
            url: '/form/wizards',
            data: {
                title: 'Wizards'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/forms/views/form-wizards.html',
                    controller: 'FormWizardCtrl'
                }
            },
            resolve: {
                srcipts: function(lazyScript){
                    return lazyScript.register([
                        'jquery-maskedinput',
                        'fuelux-wizard',
                        'jquery-validation'
                    ])

                }
            }
        })
        .state('app.form.editors', {
            url: '/form/editors',
            data: {
                title: 'Editors'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/forms/views/form-editors.html'
                }
            },
            resolve: {
                scripts: function(lazyScript){
                    return lazyScript.register([
                        'bootstrap-markdown',
                        'summernote'
                    ])
                }
            }
        })
        .state('app.form.dropzone', {
            url: '/form/dropzone',
            data: {
                title: 'Dropzone'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/forms/views/dropzone.html'
                }
            },
            resolve: {
                scripts: function(lazyScript){
                    return lazyScript.register('dropzone')
                }
            }
        })
        .state('app.form.imageEditor', {
            url: '/form/image-editor',
            data: {
                title: 'Image Editor'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/forms/views/image-editor.html',
                    controller: 'ImageEditorCtrl'
                }
            },
            resolve: {
                scripts: function(lazyScript){
                    return lazyScript.register([
                        'jcrop'
                    ])
                }
            }
        })


});