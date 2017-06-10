"use strict";

angular.module("app.hub", ["ui.router"]);

angular.module("app.hub").config(function ($stateProvider) {

    $stateProvider
        .state('app.hub', {
            url: '/hub/:schema',
            data: {
                title: 'Message Hub'
            }
        });
    });