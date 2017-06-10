"use strict";

angular.module("app.user", ["ngResource", "ui.router", "ui.bootstrap", "ui.bootstrap.modal"]);

angular.module("app.user")
    .config(function ($stateProvider, modalStateProvider) {

        $stateProvider
            .state('app.user', {
                abstract: true,
                data: {
                    title: 'User'
                }
            })
            .state('app.user.profile', {
                url: '/user/profile',
                authenticate: true,
                data: {
                    title: 'User Profile',
                    animation: false /* disable the content loading animation since $viewContentLoaded will not fire when opening modal */
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/user/views/edit-profile.html',
                        controller: 'EditProfileController'
                    }
                },
                resolve: {
                }
            })
            .state('app.user.password', {
                url: '/user/password',
                authenticate: true,
                data: {
                    title: 'Change Password',
                    animation: false /* disable the content loading animation since $viewContentLoaded will not fire when opening modal */
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/user/views/change-password.html',
                        controller: 'ChangePasswordController'
                    }
                },
                resolve: {
                }
            });
    });