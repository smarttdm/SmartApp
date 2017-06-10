'use strict';

angular.module('app.stations').controller('StationDashboardCtrl', function ($controller, $rootScope, $scope, $http, APP_CONFIG, $state, $stateParams, TestStations, promisedSettings, $interval) {

    // Live Feeds Widget Data And Display Controls
    // Live Stats Tab
    var index = $stateParams.index;
    var testStationName = TestStations.params['testStationName'];

    $scope.CurrentStationName = TestStations.stations[index][testStationName];
    $scope.dbschema = $stateParams.schema;
    $scope.dbclass = $stateParams.class;
    $scope.template = TestStations.params['testStationForm'];
    $scope.oid = $stateParams.oid;
    $scope.showMonitor = true;
  
    if (TestStations.params['monitor'] && TestStations.params['monitor'] === "hidden")
    {
        $scope.showMonitor = false;
    }

    var defaultSettings = {
        ID: "0",
        LineXName1: "X",
        LineXMin1: "0",
        LineXMax1: "100",
        LineXValue1: "0",
        LineYName1: "Y",
        LineYMin1: "0",
        LineYMax1: "100",
        LineYValue1: "0",
        PieName1: "",
        PieName2: "",
        PieName3: "",
        PieName4: "",
        PieUnit1: "",
        PieUnit2: "",
        PieUnit3: "",
        PieUnit4: "",
        PieValue1: "",
        PieValue2: "",
        PieValue3: "",
        PieValue4: "",
        PiePercent1: "0",
        PiePercent2: "0",
        PiePercent3: "0",
        PiePercent4: "0",
        ProgressName1: "",
        ProgressName2: "",
        ProgressName3: "",
        ProgressName4: "",
        ProgressUnit1: "",
        ProgressUnit2: "",
        ProgressUnit3: "",
        ProgressUnit4: "",
        ProgressValue1: "",
        ProgressValue2: "",
        ProgressValue3: "",
        ProgressValue4: "",
        ProgressPercent1: "0",
        ProgressPercent2: "0",
        ProgressPercent3: "0",
        ProgressPercent4: "0"
    };

    if ($scope.showMonitor && promisedSettings)
    {
        var settingsWrapper = promisedSettings.data
        var settings = findObjectByName(settingsWrapper, "Settings")
        if (settings)
        {
            $scope.settings = settings;
        }
        else
        {
            $scope.settings = defaultSettings;
        }
    }
    else
    {
        $scope.settings = defaultSettings;
    }

    function findObjectByName(obj, name) {
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                if (i === name)
                {
                    return obj[i];
                }
                else if (obj[i] instanceof Object)
                {
                    return findObjectByName(obj[i], name);
                }
            }
        }
        return null;
    };

    angular.extend(this, $controller('ebaasFormBaseCtrl', { $rootScope: $rootScope, $scope: $scope, $http: $http, APP_CONFIG: APP_CONFIG }));

    $scope.autoUpdate = false;
    var data = [];
    var totalPoints = 100;
    var timerInterval = 1000;
    var currentTime = new Date().getTime();

    var updateInterval = undefined;
    $scope.$watch('autoUpdate', function (autoUpdate) {

        if (autoUpdate) {
            updateInterval = $interval(function () {

                GetData(true);

                $.plot($("#updating-chart"), [data], $scope.liveStatsOptions)
            }, timerInterval)
        } else {
            $interval.cancel(updateInterval);
        }
    });

    // cancel the auto updating when exiting
    $scope.$on("$destroy", function (event) {
        if (updateInterval) {
            $interval.cancel(updateInterval);
        }
    });

    if ($scope.showMonitor) {

        GetData(false);

        $scope.liveStats = [data];
    }
    else
    {
        $scope.liveStats = [];
    }

    function GetData(fromDB) {
        data.shift(); //to remove first item of array
      
        var temp, y;
        if (fromDB && $stateParams.xmlschema)
        {
            var url = APP_CONFIG.ebaasRootUrl + "/api/data/extract/" + encodeURIComponent($stateParams.schema) + "/" + $stateParams.class + "/" + $stateParams.oid + "/" + $stateParams.xmlschema;

            $http.get(url).success(function (res) {
                var settings = findObjectByName(res, "Settings")
                if (settings) {
                    y = settings.LineYValue1;
                    $scope.settings = settings;
                }
                else
                {
                    y = 3.0; // fake data
                }

                temp = [currentTime += timerInterval, y]; //data format [x, y]

                data.push(temp);
            });
        }
        else
        {
            while (data.length < totalPoints) {
                // fake data
                 y = 2.0;
                //y = Math.random() * 100;

                temp = [currentTime += timerInterval, y]; //data format [x, y]

                data.push(temp);
            }
        }
    }

    if ($scope.showMonitor) {
        $scope.liveStatsOptions = {
            yaxis: {
                min: $scope.settings.LineYMin1,
                max: $scope.settings.LineYMax1,
                tickFormatter: function (v, axis) {
                    if (v % 10 == 0) {
                        return v;
                    } else {
                        return "";
                    }
                }
            },
            xaxis: {
                mode: "time",
                tickSize: [2, "second"],
                tickFormatter: function (v, axis) {
                    var date = new Date(v);

                    if (date.getSeconds() % 20 == 0) {
                        var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                        var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

                        return hours + ":" + minutes + ":" + seconds;
                    } else {
                        return "";
                    }
                }
            },
            colors: ['rgb(87, 136, 156)'],
            series: {
                lines: {
                    lineWidth: 1,
                    fill: true,
                    fillColor: {
                        colors: [
                            {
                                opacity: 0.4
                            },
                            {
                                opacity: 0
                            }
                        ]
                    },
                    steps: false
                }
            }
        };
    }

    // station scheduler code
    var appointmentClass = TestStations.params['appointmentClass'];
    var appointmentToStation = TestStations.params['appointmentToStation'];
    $scope.stationpk = TestStations.stations[index]["obj_pk"];

    $scope.schedulerOptions = {
        dataSource: new DevExpress.data.DataSource({
            store: new DevExpress.data.CustomStore({
                key: 'obj_id',
                load: function (options) {
                    var def = $.Deferred();

                    var filter = createFilter(options);
                    var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "/" + $scope.oid + "/" + appointmentClass + "?from=0&size=500&filter=" + JSON.stringify(filter);
                    $http.get(url).success(function (result) {
                        def.resolve(result);
                    }).error(function (err) {
                        def.reject(err);
                    });

                    return def.promise();
                },
                byKey: function (key) {

                    var def = $.Deferred();

                    var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + appointmentClass + "/" + key;

                    $http.get(url).success(function (result) {
                        def.resolve(result);
                    }).error(function (err) {
                        def.reject(err);
                    });

                    return def.promise();
                },
                insert: function (data) {

                    var def = $.Deferred();

                    //scheduler.server.saveAppointment(data.text, data.startDate, data.endDate);
                    var converted = convertModel(data)

                    // associated new appointment with the station by primary key
                    converted[appointmentToStation] = $scope.stationpk;

                    var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + appointmentClass;

                    $http.post(url, converted)
                     .success(function (result) {
                         def.resolve(result);
                     }).error(function (err) {
                         def.reject(err);
                     });

                    return def.promise();
                },
                remove: function (key) {
                    var def = $.Deferred();

                    var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + appointmentClass + "/" + key;

                    $http.delete(url).success(function (result) {
                        def.resolve(result);
                    })
                    .error(function (err) {
                        def.reject(err);
                    });

                    return def.promise();
                },
                update: function (key, data) {
                    var def = $.Deferred();

                    var converted = convertModel(data);

                    var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + appointmentClass + "/" + key;

                    $http.post(url, converted)
                     .success(function (result) {
                         def.resolve(result);
                     }).error(function (err) {
                         def.reject(err);
                     });

                    return def.promise();
                }
            }),
            map: function (item) {
                var appointment = {
                    text: item.Subject,
                    description: item.Description,
                    startDate: createDate(item.StartTime),
                    endDate: createDate(item.EndTime),
                    color: "#ff00aa",
                    obj_id: item.obj_id
                };

                //console.debug("appointment=" + JSON.stringify(appointment));
                return appointment;
            }
        }),
        views: ["month", "week", "day"],
        currentView: "month",
        currentDate: new Date(),
        firstDayOfWeek: 0,
        startDayHour: 8,
        endDayHour: 19,
        width: "100%",
        height: 600,
        onInitialized: function (e) {
            $scope.scheduleInstance = e.component;
        }
    };

    function createDate(str1) {
        // str1 format should be yyyy-mm-ddThh:mm:SS.
        var dt1 = parseInt(str1.substring(8, 10));
        var mon1 = parseInt(str1.substring(5, 7));
        var yr1 = parseInt(str1.substring(0, 4));
        var date1 = new Date(yr1, mon1 - 1, dt1);
        return date1;
    }

    function createFilter(options) {
        var filter = new Array();

        var composite = new Array();

        var expr = new Array();
        // StartTime >= intervalStartDay
        expr.push("StartTime");
        expr.push(">=");
        expr.push(options.dxScheduler.startDate);

        composite.push(expr);

        composite.push("and");

        expr = new Array();
        expr.push("StartTime");
        expr.push("<");
        expr.push(options.dxScheduler.endDate);

        composite.push(expr);

        filter.push(composite);

        filter.push("or");

        composite = new Array();
        expr = new Array();
        expr.push("EndTime");
        expr.push(">=");
        expr.push(options.dxScheduler.startDate);

        composite.push(expr);

        composite.push("and");

        expr = new Array();
        expr.push("EndTime");
        expr.push("<");
        expr.push(options.dxScheduler.endDate);

        composite.push(expr);

        filter.push(composite);

        return filter;
    }

    function convertModel(data) {
        var converted = new Object();

        converted.StartTime = data.startDate;
        converted.EndTime = data.endDate;
        converted.Subject = data.text;
        converted.Description = data.description;

        return converted;
    }

    var timezoneParseNameResults = /\((.*)\)/.exec(new Date().toString());

    if (timezoneParseNameResults && timezoneParseNameResults.length > 0) {
        $scope.timezone = timezoneParseNameResults[1];
    } else {
        var timezoneOffset = new Date().getTimezoneOffset();
        $scope.timezone = "UTC" + (timezoneOffset < 0 ? "+" : "") + timezoneOffset / (-60) + " time zone";
    }
});