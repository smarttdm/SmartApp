'use strict';

angular.module('app.taskforum').controller('PostViewCtrl', function ($scope, $http, $state, $stateParams, APP_CONFIG, User, $modalInstance, myActivityService) {

    $scope.dbschema = $stateParams.schema;
    $scope.dbclass = $stateParams.class;
    $scope.oid = $stateParams.oid;
    $scope.postClass = $stateParams.postClass;

    // get posts related to a task class
    var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($stateParams.schema) + "/" + $stateParams.class + "/" + $stateParams.oid + "/" + $stateParams.postClass + "?view=full&from=0&size=50";
    $http.get(url).success(function (data) {
        $scope.posts = data;

        if (!$scope.posts) {
            $scope.posts = new Array();
        }
    });
 
    // get posts related to a task class
    url = APP_CONFIG.ebaasRootUrl + "/api/form/primarykey/" + encodeURIComponent($stateParams.schema) + "/" + $stateParams.class + "/" + $stateParams.oid;
    $http.get(url).success(function (data) {
        $scope.taskPK = data;
    });
 
    $scope.content = "";
    $scope.postId = undefined;
    $scope.loading = false;

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

    $scope.getPosterImage = function(posterId)
    {
        return User.getUserImage(posterId);
    }

    $scope.isOwner = function (poster) {
        if (poster === User.userName) {
            return true;
        }
        else
        {
            return false;
        }
    }

    $scope.getMyImage = function()
    {
        return User.image();
    }

    $scope.getCurrentTime = function()
    {
        return new Date().toLocaleString();
    }

    $scope.EnableEditing = function(post)
    {
        post.IsEditing = true;
        var element = angular.element(document.getElementById("post-" + post.PostID));
        element.summernote($scope.options);
    }

    $scope.DisableEditing = function (post) {  
        var model = new Object();
        model.Content = angular.element(document.getElementById("post-" + post.PostID)).summernote('code');

        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.postClass + "/" + post.obj_id;

        $http.post(url, model)
            .success(function (data) {
            });

        post.IsEditing = false;

        angular.element(document.getElementById("post-" + post.PostID)).summernote('destroy');
    }

    $scope.getContentId = function (post) {
        return "post-" + post.PostID;
    }

    $scope.showAttachments = function (post)
    {
        $state.go('.attachments', { schema: $scope.dbschema, class: $scope.postClass, oid: post.obj_id }, { location: false, notify: false });
    }

    $scope.showReadOnlyAttachments = function (post) {
        $state.go('.attachments', { schema: $scope.dbschema, class: $scope.postClass, oid: post.obj_id, readonly: true }, { location: false, notify: false });
    }

    function htmlToPlaintext(text) {
        return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    }

    $scope.Post = function()
    {
        var model = new Object();
        model.Poster = User.userName;
        model.PostTime = new Date();
        model.IsPublic = "1";
        model.Content = $scope.content;
        
        model.toTestTask = $scope.taskPK;

        // add data for a default form
        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.postClass;
        if ($scope.postId) {
            url += "/" + $scope.postId;
        }

        $scope.loading = true;
        $http.post(url, model)
            .success(function (data) {
                $scope.loading = false;
                $scope.posts.push(data);

                // clear the content
                angular.element(document.getElementById("newPost")).summernote('code', "");

                // post a message to the task group
                var message = $scope.getMessage(model);
                if (message) {
                    myActivityService.create("msgs", message, function (data) {
                    });
                }
            })
            .error(function () {
                console.debug("error=" + JSON.stringify(err));
                $scope.loading = false;
            });
    }

    $scope.getMessage = function (model)
    {
        var message = undefined;

        if ($stateParams.url && $stateParams.urlparams && $stateParams.subject) {
            message = {};
            message.dbschema = $scope.dbschema;
            message.dbclass = $scope.dbclass;
            message.oid = $scope.oid;
            message.posterId = model.Poster;
            message.postTime = model.PostTime;
            message.subject = $stateParams.subject;

            var text = htmlToPlaintext($scope.content);
            if (text.length > 0) {
                if (text.length > 20) {
                    text = text.substring(0, 20);
                    text += "...";
                }
            }
            else
            {
                text = $stateParams.content;
            }

            message.content = text;
            message.url = $stateParams.url;
            message.urlparams = $stateParams.urlparams;
        }

        return message;
    }

    $scope.Delete = function (post) {
        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.postClass + "/" + post.obj_id;

        $scope.loading = true;
        $http.delete(url)
            .success(function (data) {
                $scope.loading = false;
                
                var index = -1;
                for (var i = 0; i < $scope.posts.length; i++)
                {
                    if ($scope.posts[i] === post)
                    {
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

    $scope.Save = function()
    {
        var model = new Object();
        model.Poster = User.userName;
        model.PostTime = new Date();
        model.IsPublic = "0";
        model.Content = $scope.content;
        model.toTestTask = $scope.taskPK;

        // add data for a default form
        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.postClass;
        if ($scope.postId)
        {
            url += "/" + $scope.postId;
        }

        $http.post(url, model)
            .success(function (data) {
                $scope.postId = data.obj_id
            });
    }

    $scope.closeModal = function () {
        $modalInstance.dismiss("dismiss");
    };

    var reload = function (dbschema, dbclass, oid) {
        var url = ".postview";
        var params = new Object();
        params.schema = dbschema;
        params.class = dbclass;
        params.oid = oid;
  
        $state.go($state.current, params, { reload: true }); //second parameter is for $stateParams
    }
});