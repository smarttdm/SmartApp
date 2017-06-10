'use strict';

angular.module('app.wizards').directive('previewSubmitStep', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/wizards/views/preview-submit-step.html',
        replace: true,
        scope: {},
        bindToController: {
            dbschema: '=',
            dbclass: '=',
            template: '=',
            taskId: '=',
            control: '=',
            callbackMethod: '&stepCallback'
        },
        controllerAs: 'ctrl',
        controller: 'previewSubmitStepCtrl',
        link: function (scope, element, attributes) {
        }
    }
});