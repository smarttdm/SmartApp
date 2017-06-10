"use strict";

angular.module('app.user').controller('EditProfileController', function ($http, $scope, $rootScope, User, APP_CONFIG) {
        $scope.savedSuccessfully = false;
        $scope.message = "";

        $scope.profile = User;

        $scope.save = function () {

            User.save(function () {
                $scope.message = $rootScope.getWord("ProfileUpdated");
                $scope.savedSuccessfully = true;
            })
        }

    });