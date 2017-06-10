'use strict';

angular.module('app.wizards').directive('ebaasFormWizard', function () {
    return {
        restrict: 'A',
        scope: {
            ebaasWizard : '=',
            ebaasWizardCallback: '&',
            ebaasWizardStepEntered: '&',
            ebaasWizardStepChanged: '&'
        },
        link: function (scope, element, attributes) {

            var wizard = element.wizard();

            scope.ebaasWizard = wizard;

            var $form = element.find('form');

            wizard.on('actionclicked.fu.wizard', function (e, data) {
                if (typeof scope.ebaasWizardStepChanged() === 'function') {
                    scope.ebaasWizardStepChanged()(e, data)
                }
            });

            wizard.on('changed.fu.wizard', function (e, data) {
                if (typeof scope.ebaasWizardStepEntered() === 'function') {
                    scope.ebaasWizardStepEntered()(e, data)
                }
            });

            wizard.on('finished.fu.wizard', function (e, data) {
                var formData = {};
                _.each($form.serializeArray(), function(field){
                    formData[field.name] = field.value
                });
                if(typeof scope.ebaasWizardCallback() === 'function'){
                    scope.ebaasWizardCallback()(formData)
                }
            });
        }
    }
});