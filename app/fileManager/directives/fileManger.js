'use strict';

angular.module('app.filemanager').directive('ebaasFileManager', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/filemanager/views/file-manager.html',
        replace: true,
        scope: {},
        bindToController: {
            dbschema: '=',
            dbclass: '=',
            oid: '='
        },
        controllerAs: 'vm',
        controller: 'fileManagerCtrl',
        link: function (scope, element, attributes) {
        }
    }
});