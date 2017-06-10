'use strict';

angular.module('app.dashboard', [
    'ui.router',
    'ngResource'
])

.config(function ($stateProvider) {
    $stateProvider
        .state('app.dashboard', {
            url: '/dashboard',
            views: {
                "content@app": {
                    controller: 'DashboardCtrl',
                    templateUrl: 'app/dashboard/dashboard.html'
                }
            },
            authenticate: true,
            data:{
                title: 'Dashboard'
            },
            resolve: {
                scripts: function(lazyScript){
                    return lazyScript.register([
                            'jquery-jvectormap-world-mill-en',
                            'flot-time',
                            'flot-resize'
                        ]);
                }
            }
        });
});
