'use strict';

angular.module('app.logs').directive('changelog', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/logs/views/change-log.html',
        replace: true,
        scope: {},
        controllerAs: 'vm',
        controller: 'changeLogCtrl',
        link: function (scope, element, attributes) {
        }
    }
});