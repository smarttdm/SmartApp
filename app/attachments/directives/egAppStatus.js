'use strict';

angular.module('app.attachments').directive('egAppStatus', function (loadingInfo) {
    var directive = {
        link: link,
        restrict: 'E',
        templateUrl: 'app/attachments/views/egAppStatus.html'
    };
    return directive;

    function link(scope, element, attrs) {
        scope.status = loadingInfo.status;
    }
});