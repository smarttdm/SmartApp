'use strict';

angular.module('app.wizards').directive('requestItems', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/wizards/views/request-items.html',
        replace: true,
        scope: {},
        bindToController: {
            dbschema: '=',
            dbclass: '='
        },
        controllerAs: 'ctrl',
        controller: 'requestItemsCtrl',
        link: function (scope, element, attributes) {
        }
    }
});