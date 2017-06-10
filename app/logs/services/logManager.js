'use strict';

angular.module('app.logs').factory('logManager', function ($q, $http, APP_CONFIG) {

    var service = {
        logs: [],
        load: load,
        status: {
            uploading: false
        },
        params: {
            dbschema: "",
            dbclass: "",
            oid: "",
            property: ""
        }
    };

    return service;

    function load(callback) {
        service.logs.length = 0;

        var url = APP_CONFIG.ebaasRootUrl + "/api/log/" + encodeURIComponent(service.params.dbschema) + "/" + service.params.dbclass + "/" + service.params.oid + "/" + service.params.property;

        $http.get(url).success(function (data) {

            callback(convertLogs(data));

        }).error(function () {

        });
    }

    function convertLogs(logRecordCollection) {

        var logs = [];

        if (logRecordCollection) {

            for (var i = 0; i < logRecordCollection.length; i++) {
                var logRecord = logRecordCollection[i];

                var log = {};

                switch (logRecord.actionType)
                {
                    case 1:
                        log.type = "Create";
                        break;

                    case 2:
                        log.type = "Modify";
                        break
                }
                
                log.user = logRecord.userDisplayText;
                log.time = logRecord.actionTime;
                log.content = logRecord.actionData;

                logs.push(log);
            }
        }

        return logs;
    }
});