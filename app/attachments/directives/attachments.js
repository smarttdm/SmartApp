'use strict';

angular.module('app.attachments').directive('attachments', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/attachments/views/attachments.html',
        replace: true,
        scope: {},
        bindToController: {
            dbschema: '=',
            dbclass: '=',
            oid: '=',
            read: '='
        },
        controllerAs: 'vm',
        controller: 'attachmentsCtrl',
        link: function (scope, element, attributes) {
        }
    }
});