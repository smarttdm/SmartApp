'use strict';

angular.module('app.wizards').directive('requestSamples', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/wizards/views/request-samples.html',
        replace: true,
        scope: {},
        bindToController: {
            dbschema: '=',
            dbclass: '='
        },
        controllerAs: 'ctrl',
        controller: 'requestSamplesCtrl',
        link: function (scope, element, attributes) {
        }
    }
});