'use strict';

angular.module('app.homepage').directive('demoDoughnutChart', function ($http, APP_CONFIG) {
    return {
        restrict: 'A',
        link: function (scope, element, attributes) {
            var doughnutOptions = {
                //Boolean - Whether we should show a stroke on each segment
                segmentShowStroke : true,
                //String - The colour of each segment stroke
                segmentStrokeColor : "#fff",
                //Number - The width of each segment stroke
                segmentStrokeWidth : 2,
                //Number - The percentage of the chart that we cut out of the middle
                percentageInnerCutout : 50, // This is 0 for Pie charts
                //Number - Amount of animation steps
                animationSteps : 100,
                //String - Animation easing effect
                animationEasing : "easeOutBounce",
                //Boolean - Whether we animate the rotation of the Doughnut
                animateRotate : true,
                //Boolean - Whether we animate scaling the Doughnut from the centre
                animateScale : false,
                //Boolean - Re-draw chart on page resize
                responsive: true,
                //String - A legend template
                legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
            };


            var doughnutChartUrl = scope.pageparams["doughnutChart"];

            if (doughnutChartUrl) {
                $http.get(APP_CONFIG.ebaasRootUrl + encodeURIComponent(doughnutChartUrl))
                    .success(function (res) {
                        scope.doughnutChartTitle = res.title;
                        // render chart
                        var ctx = element[0].getContext("2d");
                        new Chart(ctx).Doughnut(res.chart, doughnutOptions);
                    })
            }
        }}
});