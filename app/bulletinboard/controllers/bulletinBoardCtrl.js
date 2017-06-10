"use strict";

angular.module('app.bulletinboard').controller('bulletinBoardCtrl', function ($scope, $http, $state, $stateParams, APP_CONFIG, bulletinService) {

    $scope.dbschema = $stateParams.schema;
    $scope.dbclass = $stateParams.class;
    $scope.loading = false;

    $scope.slide = {};

    bulletinService.getPublicPosts($scope.dbschema, $scope.dbclass, function (data) {
        $scope.slides = data;
    });

    bulletinService.getPosts($scope.dbschema, $scope.dbclass, function (data) {
        $scope.posts = data;
    });

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
        loop: true
    };

    $scope.removePost = removePost;
    $scope.addPost = addPost;
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
            $state.go('app.bulletinboard.view', { schema: $scope.dbschema, class: $scope.dbclass, oid: post.obj_id });
        }
    }

    function slideChanged(index) {
        //$log.log('Slide Changed callback triggered. \n == Slide index is: ' + index + ' ==');
    }

    function addPost() {
        $state.go('app.bulletinboard.post', { schema: $scope.dbschema, class: $scope.dbclass});
    }

    function removePost(index) {
        if (index >= 0) {
            var post = $scope.posts[index];
            if (post) {
                var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + post.obj_id;

                $scope.loading = true;
                $http.delete(url)
                    .success(function (data) {
                        $scope.loading = false;
                        // remove it from post list
                        $scope.posts.splice(index, 1);

                        // remove it from the slides if it is public
                        var slideIndex = undefined;
                        var found = false;
                        for (var i = 0; i < $scope.slides.length; i++)
                        {
                            var slide = $scope.slides[i];
                            if (slide.obj_id === post.obj_id)
                            {
                                slideIndex = i;
                                found = true;
                                break;
                            }
                        }

                        if (found)
                        {
                            $scope.slides.splice(slideIndex, 1);
                        }
                    })
                .error(function () {
                    $scope.loading = false;
                });
            }
        }
    }
});