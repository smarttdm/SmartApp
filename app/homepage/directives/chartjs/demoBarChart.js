'use strict';

angular.module('app.homepage').directive('demoBarChart', function ($http, APP_CONFIG) {
    return {
        restrict: 'A',
        link: function (scope, element, attributes) {

            var barOptions = {
                //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
                scaleBeginAtZero : true,
                //Boolean - Whether grid lines are shown across the chart
                scaleShowGridLines : true,
                //String - Colour of the grid lines
                scaleGridLineColor : "rgba(0,0,0,.05)",
                //Number - Width of the grid lines
                scaleGridLineWidth : 1,
                //Boolean - If there is a stroke on each bar
                barShowStroke : true,
                //Number - Pixel width of the bar stroke
                barStrokeWidth : 1,
                //Number - Spacing between each of the X value sets
                barValueSpacing : 5,
                //Number - Spacing between data sets within X values
                barDatasetSpacing : 1,
                //Boolean - Re-draw chart on page resize
                responsive: true,
                //String - A legend template
                legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
            }

            var barChartUrl = scope.pageparams["barChart"];

            if (barChartUrl) {
                $http.get(APP_CONFIG.ebaasRootUrl + encodeURIComponent(barChartUrl))
                    .success(function (res) {
                        scope.barChartTitle = res.title;
                        var ctx = element[0].getContext("2d");
                        new Chart(ctx).Bar(res.chart, barOptions);
                    })
            }

        }
    }
});