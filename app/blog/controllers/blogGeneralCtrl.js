'use strict';

angular.module('app.blog').controller('blogGeneralCtrl', function ($scope, $rootScope, $http, $state, $stateParams, APP_CONFIG, User, blogService) {
    $scope.dbschema = "COMMON";
    $scope.dbclass = "BlogGroup";
    $scope.groupName = $stateParams.groupName;
    $scope.groupId = $stateParams.groupId;
    $scope.blogClass = "Blog";

    $scope.keywords = "";
    if ($stateParams.keywords)
    {
        $scope.keywords = $stateParams.keywords;
    }

    if ($stateParams.pageIndex) {
        $scope.pageIndex = parseInt($stateParams.pageIndex);
    }
    else {
        $scope.pageIndex = 0;
    }

    // Getting blog groups
    blogService.getGroups($scope.dbschema, $scope.dbclass, 0, function (data) {
        $scope.groups = data;
    });

    // Getting blogs
    blogService.getBlogs($scope.dbschema, $scope.dbclass, $scope.groupId, $scope.blogClass, 0, function (data) {
        $scope.blogs = data;
    });

    // Getting popular blogs
    blogService.getPopularBlogs($scope.dbschema, $scope.blogClass, function (data) {
        $scope.popularblogs = data;

    });

    $scope.reload = function (pageIndex) {

        $scope.pageIndex = pageIndex;

        blogService.getBlogs($scope.dbschema, $scope.dbclass, $scope.groupId, $scope.blogClass, pageIndex, function (data) {

            $scope.blogs = data;
        });
    }

    $scope.prev = function () {
        if ($scope.pageIndex > 0) {
            var pageIndex = $scope.pageIndex - 1;
            $scope.pageIndex = pageIndex;

            blogService.getBlogs($scope.dbschema, $scope.dbclass, $scope.groupId, $scope.blogClass, pageIndex, function (data) {

                $scope.blogs = data;
            });
        }
    }

    $scope.next = function () {
        var pageIndex = $scope.pageIndex + 1;
        $scope.pageIndex = pageIndex;

        blogService.getBlogs($scope.dbschema, $scope.dbclass, $scope.groupId, $scope.blogClass, pageIndex, function (data) {

            $scope.blogs = data;
        });
    }

    $scope.getContentId = function (blog) {
        return "blog-" + blog.id;
    }

    $scope.isOwner = function (poster) {
        if (poster === User.userName) {
            return true;
        }
        else {
            return false;
        }
    }

    $scope.searchBlogs = function () {
        blogService.searchBlogs($scope.dbschema, $scope.blogClass, $scope.keywords, 0, function (data) {
            $scope.blogs = data;
        });
    }
});