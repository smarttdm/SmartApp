'use strict';

angular.module('app.stations').controller('StationSchedulerCtrl', function ($scope, $http, $stateParams, APP_CONFIG, TestStations) {

    var index = $stateParams.index;
    var testStationName = TestStations.params['testStationName'];
    var appointmentClass = TestStations.params['appointmentClass'];
    var appointmentToStation = TestStations.params['appointmentToStation'];

    $scope.CurrentStationName = TestStations.stations[index][testStationName];
    $scope.dbschema = $stateParams.schema;
    $scope.dbclass = $stateParams.class;
    $scope.oid = TestStations.stations[index]["obj_id"];
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
        currentDate: new Date(2016, 3, 25),
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

    function convertModel(data)
    {
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