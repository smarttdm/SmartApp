"use strict";


angular.module('app.layout', ['ui.router', 'pdf'])

.config(function ($stateProvider, $urlRouterProvider) {


    $stateProvider
        .state('app', {
            abstract: true,
            views: {
                root: {
                    controller: 'layoutCtrl',
                    templateUrl: 'app/layout/layout.tpl.html'
                }
            },
            resolve: {
                scripts: function(lazyScript){
                    return lazyScript.register([
                            'sparkline',
                            'easy-pie'
                        ]);
                }
            }
        });

    $urlRouterProvider.otherwise(function ($injector, $location) {
        return "/home/mainmenu";
    });

})

