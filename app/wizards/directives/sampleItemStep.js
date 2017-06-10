'use strict';

angular.module('app.wizards').directive('sampleItemStep', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/wizards/views/sample-item-step.html',
        replace: true,
        scope: {},
        bindToController: {
            dbschema: '=',
            dbclass: '=',
            control: '=',
            callbackMethod: '&stepCallback'
        },
        controllerAs: 'ctrl',
        controller: 'sampleItemStepCtrl',
        link: function (scope, element, attributes) {
        }
    }
});