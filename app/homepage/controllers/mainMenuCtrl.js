"use strict";


angular.module('app.homepage').controller('mainMenuCtrl', function ($scope, $http, $state, $stateParams, APP_CONFIG, promisedMenuItems, bulletinService, User) {

    $scope.dbschema = undefined;
    $scope.dbclass = undefined;

    var menuItems = new Array();
    _.forEach(promisedMenuItems.data.items, function (item) {
        if (item.visible) {
            if (item.sref) {
                if (!item.desc)
                    item.desc = "col-xs-4 col-sm-3 col-md-2 page-darkblue";

                if (!item.icon)
                    item.icon = "fa fa-cog";

                // do not show home menu item on the home page
                if (item.name.toUpperCase() != "HOME") {
                    menuItems.push(item);
                }
                else
                {
                    $scope.dbschema = item.schema;
                    $scope.dbclass = item.class;
                }
            }
            else if (item.items) {
                _.forEach(item.items, function (child) {
                    if (!child.desc)
                        child.desc = "col-xs-4 col-sm-3 col-md-2 page-gray";

                    if (!child.icon)
                        child.icon = "fa fa-cog";

                    menuItems.push(child);
                })
            }
        }
    })

    $scope.menuItems = menuItems;

    if ($scope.dbschema) {
        bulletinService.getPublicPosts($scope.dbschema, $scope.dbclass, function (data) {
            $scope.slides = data;
        });
    }

    $scope.options = {
        visible: 5,
        perspective: 35,
        startSlide: 0,
        border: 3,
        dir: 'ltr',
        clicking: true,
        width: 360,
        height: 270,
        space: 220,
        autoRotationSpeed: 10000,
        loop: true
    };

    $scope.selectedClick = selectedClick;
    $scope.slideChanged = slideChanged;
    $scope.beforeChange = beforeChange;
    $scope.lastSlide = lastSlide;


    function lastSlide(index) {
        //$log.log('Last Slide Selected callback triggered. \n == Slide index is: ' + index + ' ==');
    }

    function beforeChange(index) {
        //$log.log('Before Slide Change callback triggered. \n == Slide index is: ' + index + ' ==');
    }

    function selectedClick(index) {
        if (index >= 0) {
            var post = $scope.slides[index];
            $state.go('app.bulletinboard.view', {schema: $scope.dbschema, class: $scope.dbclass, oid: post.obj_id });
        }
    }

    function slideChanged(index) {
        //$log.log('Slide Changed callback triggered. \n == Slide index is: ' + index + ' ==');
    }
});