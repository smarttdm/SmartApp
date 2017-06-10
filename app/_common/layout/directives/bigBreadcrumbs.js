'use strict';

angular.module('SmartAdmin.Layout').directive('bigBreadcrumbs', function () {
    return {
        restrict: 'EA',
        replace: true,
        template: '<div><div class="pull-left"><h3 id="return-home" ui-sref="app.homepage.mainmenu" class="page-title txt-color-blueDark"><i class="pointer-icon fa-fw fa fa-home"></i></h3></div><div ng-show="hasHashCode" class="pull-right hidden-mobile"><a ui-sref=".help" class="btn btn-info btn-sm"><i class="fa fa-question-circle fa-lg"></i>&nbsp;&nbsp;{{getWord("Help")}}</a></div></div>',
        scope: {
            items: '=',
            icon: '@'
        },
        controller: 'bigBreadcrumbsCtlr',
        link: function (scope, element) {
            var first = _.first(scope.items);

            //var icon = scope.icon || 'home';
            element.find('h3').append(first);
            _.rest(scope.items).forEach(function (item) {
                element.find('h3').append(' <span>> ' + item + '</span>')
            });
        }
    }
});
