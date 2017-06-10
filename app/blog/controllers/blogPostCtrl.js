'use strict';

angular.module('app.blog').controller('blogPostCtrl', function ($scope, $rootScope, $http, $state, $stateParams, APP_CONFIG, User, blogService, promisedGroups, promisedImages) {

    $scope.dbschema = "COMMON";
    $scope.groupClass = "BlogGroup";
    $scope.dbclass = "Blog";
    $scope.oid = $stateParams.oid;

    $scope.loading = false;

    $scope.groupList = promisedGroups.data;

    $scope.images = promisedImages.data;

    $scope.showImages = false;

    if ($scope.oid) {
        // Getting the blog to edit
        blogService.getBlog($scope.dbschema, $scope.dbclass, $scope.oid, function (data) {
 
            $scope.blog = data;
        });
    }
    else
    {
        $scope.blog = {};

        var defaultImage = "superbox-full-5.jpg";
        if ($scope.images.length > 0) {
            defaultImage = $scope.images[0].name;
        }
        $scope.blog.image = "styles/custom/blogs/" + defaultImage; // default image
    }

    $scope.options = {
        height: 500,
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

    $scope.setShowImages = function (status) {
        $scope.showImages = status;
    }

    $scope.getPosterImage = function (posterId) {
        return User.getUserImage(posterId);
    }

    $scope.getMyImage = function () {
        return User.image();
    }

    $scope.getCurrentTime = function () {
        return new Date().toLocaleString();
    }

    $scope.getContentId = function (blog) {
        return "blog-" + blog.id;
    }

    $scope.Save = function (isPublic) {
        var model = new Object();
        model.Poster = User.userName;
        model.PostTime = new Date();
        model.IsPublic = isPublic;
        model.Abstract = $scope.blog.abstract;
        model.Content = $scope.blog.content;
        model.Name = $scope.blog.name;
        model.Image = $scope.blog.image;
        model.toGroup = $scope.blog.toGroup;

        // add data for a default form
        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass;
        if ($scope.oid) {
            url += "/" + $scope.oid;
        }

        $scope.loading = true;
        $http.post(url, model)
            .success(function (data) {
                $scope.loading = false;

                // clear the content
                //angular.element(document.getElementById("newPost")).summernote('code', "");
            })
            .error(function (err) {
                console.debug("error=" + JSON.stringify(err));
                $scope.loading = false;
            });

        if (isPublic)
        {
            if ($scope.groupClass) {
                $state.go('app.blog', { schema: $scope.dbschema, class: $scope.groupClass, groupId: $stateParams.groupId, pageIndex: $stateParams.pageIndex });
            }
            else
            {
                $state.go('app.myspace', { schema: $scope.dbschema });
            }
        }
    }

    $scope.selectImage = function(imageUrl)
    {
        $scope.blog.image = imageUrl;
    }
});