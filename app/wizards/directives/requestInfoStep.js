'use strict';

angular.module('app.wizards').directive('requestInfoStep', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/wizards/views/request-info-step.html',
        replace: true,
        scope: {},
        bindToController: {
            dbschema: '=',
            dbclass: '=',
            template: '=',
            control: '=',
            callbackMethod: '&stepCallback'
        },
        controllerAs: 'ctrl',
        controller: 'requestInfoStepCtrl',
        link: function (scope, element, attributes) {
        }
    }
});