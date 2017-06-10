'use strict';

angular.module('app.forum').controller('forumPostCtrl', function ($scope, $rootScope, $http, $state, $stateParams, APP_CONFIG, User, forumService, myActivityService) {

    $scope.dbschema = $stateParams.schema;
    $scope.dbclass = $stateParams.class;
    $scope.groupCategory = $stateParams.category;
    $scope.topicClass = "Topic";
    $scope.postClass = "Post";
    $scope.groupName = $stateParams.groupName;
    $scope.groupId = $stateParams.groupId;
    $scope.topicName = $stateParams.topicName;

    $scope.loading = false;

    $scope.topicPK = $stateParams.topicPK;

    $scope.content = "";
    $scope.postId = undefined;

    if ($stateParams.pageIndex) {
        $scope.pageIndex = parseInt($stateParams.pageIndex);
    }
    else {
        $scope.pageIndex = 0;
    }

    $scope.options = {
        height: 200,
        focus: true,
        toolbar: [
                ['edit', ['undo', 'redo']],
                ['headline', ['style']],
                ['style', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'strikethrough', 'clear']],
                ['fontface', ['fontname']],
                ['textsize', ['fontsize']],
                ['fontclr', ['color']],
                ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
                ['table', ['table']],
                ['insert', ['link', 'picture', 'video', 'hr']],
                ['view', ['fullscreen', 'codeview']]
        ]
    };

    $scope.getPosterImage = function (posterId) {
        return User.getUserImage(posterId);
    }

    $scope.isOwner = function (poster) {
        if (poster === User.userName) {
            return true;
        }
        else {
            return false;
        }
    }

    $scope.getMyImage = function () {
        return User.image();
    }

    $scope.getCurrentTime = function () {
        return new Date().toLocaleString();
    }

    $scope.EnableEditing = function (post) {
        post.IsEditing = true;
        var element = angular.element(document.getElementById("post-" + post.PostID));
        element.summernote($scope.options);
    }

    $scope.DisableEditing = function (post) {
        var model = new Object();
        model.Content = angular.element(document.getElementById("post-" + post.PostID)).summernote('code');

        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($stateParams.schema) + "/" + $scope.postClass + "/" + post.obj_id;

        $http.post(url, model)
            .success(function (data) {
            });

        post.IsEditing = false;

        angular.element(document.getElementById("post-" + post.PostID)).summernote('destroy');
    }

    $scope.getContentId = function (post) {
        return "post-" + post.PostID;
    }

    $scope.showAttachments = function (post) {
        $state.go('app.smarttables.datagrid.attachments', { schema: $stateParams.schema, class: $scope.postClass, oid: post.obj_id }, { location: false, notify: false });
    }

    $scope.showReadOnlyAttachments = function (post) {
        $state.go('app.smarttables.datagrid.attachments', { schema: $stateParams.schema, class: $scope.postClass, oid: post.obj_id, readonly: true }, { location: false, notify: false });
    }

    $scope.Post = function () {
        var post = new Object();
        post.poster = User.userName;
        post.postTime = new Date();
        post.content = $scope.content;
        post.topicPK = $scope.topicPK;

        $scope.loading = true;

        // Add post
        forumService.addPost($stateParams.schema, $scope.postClass, post, function (data) {

            $scope.loading = false;

            // add the new post to the list
            $scope.posts.push(data);

            // clear the content
            angular.element(document.getElementById("newPost")).summernote('code', "");
        });
    }

    $scope.Delete = function (post) {
        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($stateParams.schema) + "/" + $scope.postClass + "/" + post.obj_id;

        $scope.loading = true;
        $http.delete(url)
            .success(function (data) {
                $scope.loading = false;

                var index = -1;
                for (var i = 0; i < $scope.posts.length; i++) {
                    if ($scope.posts[i] === post) {
                        index = i;
                        break;
                    }
                }

                if (index >= 0) {
                    $scope.posts.splice(index, 1);
                }
            })
        .error(function () {
            $scope.loading = false;
        });
    }

    $scope.Save = function () {
        var model = new Object();
        model.Poster = User.userName;
        model.PostTime = new Date();
        model.IsPublic = "0";
        model.Content = $scope.content;
        model.toTestTask = $scope.taskPK;

        // add data for a default form
        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($stateParams.schema) + "/" + $scope.postClass;
        if ($scope.postId) {
            url += "/" + $scope.postId;
        }

        $http.post(url, model)
            .success(function (data) {
                $scope.postId = data.obj_id
            });
    }

    // Getting posts
    forumService.getPosts($stateParams.schema, $scope.topicClass, $stateParams.topicId, $scope.postClass, 0, function (data) {

        $scope.posts = data;
    });

    $scope.reload = function (pageIndex) {

        $scope.pageIndex = pageIndex;

        forumService.getPosts($stateParams.schema, $scope.topicClass, $stateParams.topicId, $scope.postClass, pageIndex, function (data) {

            $scope.topics = data;
        });
    }

    $scope.prev = function () {
        if ($scope.pageIndex > 0) {
            var pageIndex = $scope.pageIndex - 1;
            $scope.pageIndex = pageIndex;

            forumService.getPosts($stateParams.schema, $scope.topicClass, $stateParams.topicId, $scope.postClass, pageIndex, function (data) {

                $scope.topics = data;
            });
        }
    }

    $scope.next = function () {
        var pageIndex = $scope.pageIndex + 1;
        $scope.pageIndex = pageIndex;

        forumService.getPosts($stateParams.schema, $scope.topicClass, $stateParams.topicId, $scope.postClass, pageIndex, function (data) {

            $scope.topics = data;
        });
    }

    function isMine(poster)
    {
        if (poster === User.userName) {
            return true;
        }
        else {
            return false;
        }
    }

    function neverSent(poster, receivers)
    {
        var status = true;

        for (var i = 0; i < receivers.length; i++)
        {
            if (poster === receivers[i])
            {
                status = false;
                break;
            }
        }

        return status;
    }
});