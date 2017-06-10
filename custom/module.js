'use strict';

/**
 * Custom module of the application.
 */

angular.module('app.custom', [
    'app.custom.tasktrack'
]);

angular.module("app.custom").config(function ($stateProvider) {
    $stateProvider
        .state('app.custom', {
            abstract: true,
            data: {
                title: 'custom',
            }
        });
});


