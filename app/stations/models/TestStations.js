

'use strict';

angular.module('app.stations').factory('TestStations', function () {

    var TestStationsModel = {
        params: undefined,
        stations: undefined,
        error: "",
        init: function()
        {
            this.params = undefined;
            this.stations = undefined;
            this.error = "";
        }
    };

    return TestStationsModel;
});
