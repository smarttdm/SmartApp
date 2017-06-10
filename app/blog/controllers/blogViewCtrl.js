'use strict';

angular.module('app.blog').controller('blogViewCtrl', function ($scope, $state, $stateParams, APP_CONFIG, User, blogService) {
    $scope.dbschema = "COMMON";
    $scope.groupClass = "BlogGroup";
    $scope.blogClass = "Blog";
    $scope.oid = $stateParams.oid;
    $scope.commentClass = "Comment";

    $scope.hideComments = false;
    $scope.comment = "";

    $scope.keywords = "";

    // Getting popular blogs
    blogService.getPopularBlogs($stateParams.schema, $scope.blogClass, function (data) {
        $scope.popularblogs = data;

    });

    if ($scope.oid) {
        // Getting the blog to edit
        blogService.getBlog($scope.dbschema, $scope.blogClass, $scope.oid, function (data) {
 
            $scope.blog = data;

            blogService.getComments($scope.dbschema, $scope.blogClass, $scope.oid, $scope.commentClass, 0, function (data) {

                $scope.blog.comments = data;
            });
        });
    }
    else
    {
        $scope.blog = new Object();
    }

    $scope.getPosterImage = function (posterId) {
        return User.getUserImage(posterId);
    }

    $scope.setHideComments = function (status) {
        $scope.hideComments = status;
    }

    $scope.submitComment = function () {
        var comment = new Object();

        comment.poster = User.userName;
        comment.postTime = new Date();
        comment.content = $scope.comment;

        blogService.postComment($scope.dbschema, $scope.commentClass, $scope.blog.id, comment, function (data) {
            console.debug("post comment completed");
            $scope.blog.comments.push(comment);
            $scope.blog.commentQty++;

            $scope.comment = "";
        });
    }

    $scope.searchBlogs = function () {
        $state.go('app.blog', { keywords: $scope.keywords });
    }
});