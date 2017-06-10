'use strict';

angular.module('app.homepage').directive('demoRadarChart', function ($http, APP_CONFIG) {
    return {
        restrict: 'A',
        link: function (scope, element, attributes) {

            var radarOptions = {
                //Boolean - Whether to show lines for each scale point
                scaleShowLine : true,
                //Boolean - Whether we show the angle lines out of the radar
                angleShowLineOut : true,
                //Boolean - Whether to show labels on the scale
                scaleShowLabels : false,
                // Boolean - Whether the scale should begin at zero
                scaleBeginAtZero : true,
                //String - Colour of the angle line
                angleLineColor : "rgba(0,0,0,.1)",
                //Number - Pixel width of the angle line
                angleLineWidth : 1,
                //String - Point label font declaration
                pointLabelFontFamily : "'Arial'",
                //String - Point label font weight
                pointLabelFontStyle : "normal",
                //Number - Point label font size in pixels
                pointLabelFontSize : 10,
                //String - Point label font colour
                pointLabelFontColor : "#666",
                //Boolean - Whether to show a dot for each point
                pointDot : true,
                //Number - Radius of each point dot in pixels
                pointDotRadius : 3,
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
            }

            var radarChartUrl = scope.pageparams["radarChart"];

            if (radarChartUrl) {
                $http.get(APP_CONFIG.ebaasRootUrl + encodeURIComponent(radarChartUrl))
                    .success(function (res) {
                        scope.radarChartTitle = res.title;
                        // render chart
                        var ctx = element[0].getContext("2d");
                        var myNewChart = new Chart(ctx).Radar(res.chart, radarOptions);
                    })
            }
        }}
});