"use strict";

angular.module('app.dataviewer').directive('flotLineChart', function (FlotConfig) {
    return {
        restrict: 'E',
        replace: true,
        template: '<div id="plotChart" class="chart" style="width:100%;height:400px"></div>',
        scope: {
            data: '=',
            timeseries: '=',
            forecasteddata: '=',
            frequency: "=",
            setSelectedRange: '='
        },
        link: function (scope, element) {

            var plot = $.plot(element, scope.data, scope.chartOptions);

            element.on("plothover", function (event, pos, item) {
                if (item) {
                    var x = "";
                    if (item.datapoint[0] < scope.timeseries.length) {
                        x = getXValue(scope.timeseries[item.datapoint[0]]['Index']);
                    }
                    else if (scope.forecasteddata && item.dataIndex < scope.forecasteddata.length)
                    {
                        x = getXValue(scope.forecasteddata[item.dataIndex]['Index']);
                    }
                    $("#hoverdata").text("(" + item.series.label + ":  x = " + x + ";  y = " + item.datapoint[1] + ")");
                    //plot.highlight(item.series, item.datapoint);
                }
            });

            element.on("plotselected", function (event, ranges) {
                if (ranges) {
                    if (typeof scope.setSelectedRange(ranges.xaxis.from, ranges.xaxis.to) === 'function') {
                        //scope.setSelectedRange()(ranges.xaxis.from, ranges.xaxis.to);
                    }
                }
            });

            element.on("plotunselected", function (event) {
                if (typeof scope.setSelectedRange(undefined, undefined) === 'function') {
                    //scope.setSelectedRange()(undefined, undefined);
                }
            });

            function getXValue(val)
            {
                if (scope.frequency === "Minute" ||
                    scope.frequency === "Second")
                {
                    var pos = val.indexOf(' ');
                    if (pos > 0)
                    {
                        return val.substring(pos + 1);
                    }
                    else
                    {
                        return val;
                    }

                }
                else
                {
                    return val;
                }
            }
        }
    }
});