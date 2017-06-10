'use strict';

angular.module('app.homepage').directive('demoLineChart', function ($http, APP_CONFIG) {
    return {
        restrict: 'A',
        link: function (scope, element, attributes) {

            // LINE CHART
            // ref: http://www.chartjs.org/docs/#line-chart-introduction
            var lineOptions = {
                ///Boolean - Whether grid lines are shown across the chart
                scaleShowGridLines : true,
                //String - Colour of the grid lines
                scaleGridLineColor : "rgba(0,0,0,.05)",
                //Number - Width of the grid lines
                scaleGridLineWidth : 1,
                //Boolean - Whether the line is curved between points
                bezierCurve : true,
                //Number - Tension of the bezier curve between points
                bezierCurveTension : 0.4,
                //Boolean - Whether to show a dot for each point
                pointDot : true,
                //Number - Radius of each point dot in pixels
                pointDotRadius : 4,
                //Number - Pixel width of point dot stroke
                pointDotStrokeWidth : 1,
                //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
                pointHitDetectionRadius : 20,
                //Boolean - Whether to show a stroke for datasets
                datasetStroke : true,
                //Number - Pixel width of dataset stroke
                datasetStrokeWidth : 2,
                //Boolean - Whether to fill the dataset with a colour
                datasetFill : true,
                //Boolean - Re-draw chart on page resize
                responsive: true,
                //String - A legend template
                legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
            };

            var lineChartUrl = scope.pageparams["lineChart"];
            
            if (lineChartUrl) {
                $http.get(APP_CONFIG.ebaasRootUrl + encodeURIComponent(lineChartUrl))
                    .success(function (res) {
                        scope.lineChartTitle = res.title;
                        var ctx = element[0].getContext("2d");
                        var myNewChart = new Chart(ctx).Line(res.chart, lineOptions);
                    })
            }
        }
    }
});