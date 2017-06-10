'use strict';

angular.module('app.bulletinboard').controller('bulletinPostCtrl', function ($scope, $rootScope, $http, $state, $stateParams, APP_CONFIG, promisedImages, bulletinService) {

    $scope.dbschema = $stateParams.schema;
    $scope.dbclass = $stateParams.class;
    $scope.oid = $stateParams.oid;

    $scope.loading = false;
    $scope.message = "";

    $scope.images = promisedImages.data;

    $scope.showImages = false;

    if ($scope.oid) {
        // Getting the post to edit
        bulletinService.getPostByID($scope.dbschema, $scope.dbclass, $scope.oid, function (data) {
            if (data.IsPublic)
            {
                if (data.IsPublic === $rootScope.getWord("True"))
                    data.IsPublic = "1";
                else
                    data.IsPublic = "2";
            }
            $scope.post = data;
        });
    }
    else
    {
        $scope.post = {};
        var defaultImage = "photo2.jpg";
        if ($scope.images.length > 0)
        {
            defaultImage = $scope.images[0].name;
        }
        $scope.post.Image = "styles/custom/bulletin/" + defaultImage; // default image
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

    $scope.Save = function () {
        var model = new Object();
        if ($scope.post.CreateDate)
            model.CreateDate = $scope.post.CreateDate;
        else
            model.CreateDate = new Date().toLocaleString();
   
        model.Caption = $scope.post.Caption;
        model.Content = $scope.post.Content;
        model.Image = $scope.post.Image;
        model.IsPublic = $scope.post.IsPublic;

        // add data for a default form
        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass;
        if ($scope.oid) {
            url += "/" + $scope.oid;
        }

        $scope.loading = true;
        $http.post(url, model)
            .success(function (data) {
                $scope.loading = false;
                $scope.message = $rootScope.getWord("Post Submitted");
                // clear the content
                //angular.element(document.getElementById("newPost")).summernote('code', "");
            })
            .error(function (err) {
                $scope.loading = false;
            });
    }

    $scope.selectImage = function(imageUrl)
    {
        $scope.post.Image = imageUrl;
    }
});