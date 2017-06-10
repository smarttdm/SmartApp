"use strict";

angular.module('app.graphs', [
    'ui.router'
]).config(function ($stateProvider) {
    $stateProvider
        .state('app.graphs', {
            abstract: true,
            data: {
                title: 'Graphs'
            }
        })

        .state('app.graphs.flot', {
            url: '/graphs/flot',
            data: {
                title: 'Flot Charts'
            },
            views: {
                "content@app": {
                    controller: 'FlotCtrl',
                    templateUrl: "app/graphs/views/flot-charts.html"
                }
            },
            resolve: {
                scripts: function(lazyScript){
                    return lazyScript.register([
                        'flot',
                        'flot-resize',
                        'flot-fillbetween',
                        'flot-orderBar',
                        'flot-pie',
                        'flot-time',
                        'flot-tooltip'
                    ]);
                }
            }
        })

        .state('app.graphs.morris', {
            url: '/graphs/morris',
            data: {
                title: 'Morris Charts'
            },
            views: {
                "content@app": {
                    templateUrl: "app/graphs/views/morris-charts.html"
                }
            },
            resolve: {
                scripts: function(lazyScript){
                    return lazyScript.register([
                        'morris'
                    ]);
                }
            }
        })

        .state('app.graphs.inline', {
            url: '/graphs/inline',
            data: {
                title: 'Inline Charts'
            },
            views: {
                "content@app": {
                    templateUrl: "app/graphs/views/inline-charts.html"
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
        })

        .state('app.graphs.dygraphs', {
            url: '/graphs/dygraphs',
            data: {
                title: 'Dygraphs Charts'
            },
            views: {
                "content@app": {
                    templateUrl: "app/graphs/views/dygraphs-charts.html"
                }
            },
            resolve: {
                scripts: function(lazyScript){
                    return lazyScript.register([
                        'dygraphs'
                    ]);
                }
            }
        })
        .state('app.graphs.chartjs', {
            url: '/graphs/chartjs',
            data: {
                title: 'Chartjs'
            },
            authenticate: true,
            views: {
                "content@app": {
                    templateUrl: "app/graphs/views/chartjs-charts.html"
                }
            },
            resolve: {
                scripts: function(lazyScript){
                    return lazyScript.register([
                        'chartjs'
                    ]);
                }
            }
        })
});