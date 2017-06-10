'use strict';

angular.module('app.smartforms').directive('buttonSpinner', function ($compile) {
    return {
        restrict: 'A',
        scope: {
            spinning: '=buttonSpinner',
            spinningIcon: '@?',
            buttonPrepend: '@?',
            buttonAppend: '@?'
        },
        transclude: true,
        template: 
        "<span ng-if=\"!!buttonPrepend\" ng-hide=\"spinning\"><i class=\"{{ buttonPrepend }}\"></i>&nbsp;</span>" +
        "<span ng-if=\"!!buttonPrepend\" ng-show=\"spinning\"><i class=\"{{ !!spinningIcon ? spinningIcon : 'fa fa-spinner fa-spin' }}\"></i>&nbsp;</span>" +
        "<ng-transclude></ng-transclude>" +
        "<span ng-if=\"!!buttonAppend\" ng-hide=\"spinning\">&nbsp;<i class=\"{{ buttonAppend }}\"></i></span>" +
        "<span ng-if=\"!buttonPrepend\" ng-show=\"spinning\">&nbsp;<i class=\"{{ !!spinningIcon ? spinningIcon : 'fa fa-spinner fa-spin' }}\"></i></span>"
    }
});