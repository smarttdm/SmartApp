"use strict";

angular.module("app.datacart", ["ui.router", "ui.bootstrap"]);

angular.module("app.datacart").config(function ($stateProvider) {

    $stateProvider
        .state('app.datacart', {
            url: '/datacart/:schema/:class',
            data: {
                title: 'Data Cart'
            },
            views: {
                "content@app": {
                    controller: 'dataCartCtrl',
                    templateUrl: "app/datacart/views/data-cart.html"
                }
            }
        });
    });