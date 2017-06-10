"use strict";

angular.module('app.user').controller('ChangePasswordController', function ($http, $scope, $rootScope, User, APP_CONFIG) {
        $scope.savedSuccessfully = false;
        $scope.message = "";

        $scope.registration = {
            userName: User.userName,
            password: "",
            newPassword: "",
            confirmNewPassword: ""
        };

        $scope.save = function () {
 
            if ($scope.registration.newPassword != $scope.registration.confirmNewPassword)
            {
                $scope.savedSuccessfully = false;
                $scope.message = $rootScope.getWord("ConfirmPasswordIncorrect");
            }
            else if ($scope.registration.newPassword.length < 3)
            {
                $scope.savedSuccessfully = false;
                $scope.message = $rootScope.getWord("NewPasswordInvalid");
            }
            else
            {
                var model = {};
                model.oldPassword = $scope.registration.password;
                model.newPassword = $scope.registration.newPassword;
                model.confirmPassword = $scope.registration.confirmNewPassword;
                $http.post(APP_CONFIG.ebaasRootUrl + '/api/accounts/ChangePassword', model).success(function (data) {
                    $scope.message = $rootScope.getWord("PasswordUpdated");
                    $scope.savedSuccessfully = true;
                })
                .error(function (err) {
                    console.log(err);
                    $scope.message = err.message;
                    $scope.savedSuccessfully = false;
                });
            }
        };

    });