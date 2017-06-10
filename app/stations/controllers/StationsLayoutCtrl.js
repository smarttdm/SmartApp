'use strict';

angular.module('app.stations').controller('StationsLayoutCtrl', function ($http, APP_CONFIG, $scope, $rootScope, $state, $stateParams, stationParams, TestStations, MetaDataCache) {

    $scope.dbschema = $stateParams.schema;
    $scope.dbclass = $stateParams.class;
 
    TestStations.params = stationParams.data;

    var testStationGroup = TestStations.params['testStationGroup'];
    var testStationName = TestStations.params['testStationName'];
    var testStationStatus = TestStations.params['testStationStatus'];

    if (MetaDataCache.getNamedData("stationTree")) {
        $scope.stationTree = MetaDataCache.getNamedData("stationTree");

        if (TestStations.stations.length > 0) {
            // show the dashboard of the first station by default
            var oid = TestStations.stations[0].obj_id;
            $state.go('app.stations.dashboard', { schema: $stateParams.schema, class: $stateParams.class, oid: oid, xmlschema: TestStations.params['xmlSchemaName'], index: 0 });
        }
    }
    else {
        // url to get station tree model, assuming no more than 1000 stations
        var url = APP_CONFIG.ebaasRootUrl + "/api/data/" + encodeURIComponent($scope.dbschema) + "/" + $scope.dbclass + "?view=full&from=0&size=1000";

        $http.get(url).then(function (res) {

            TestStations.stations = res.data;

            $scope.stationTree = CreateTree(testStationGroup,
                testStationName,
                testStationStatus,
                $scope.dbclass);

            MetaDataCache.setNamedData("stationTree", $scope.stationTree);

            if (TestStations.stations.length > 0) {
                // show the dashboard of the first station by default
                var oid = TestStations.stations[0].obj_id;
                $state.go('app.stations.dashboard', { schema: $stateParams.schema, class: $stateParams.class, oid: oid, xmlschema: TestStations.params['xmlSchemaName'], index: 0 });
            }
        });
    }

    function GetNodeClass(status)
    {
        var nodeClass;
      
        switch (status)
        {
            case $rootScope.getWord("Available"):
                nodeClass = "label label-primary";
                break;

            case $rootScope.getWord("Occupied"):
                nodeClass = "label label-success";
                break;

            case $rootScope.getWord("Under Maintenance"):
                nodeClass = "label label-warning";
                break;

            case $rootScope.getWord("Not In Service"):
                nodeClass = "label label-danger";
                break;

            default:
                nodeClass = "label label-info";

                break;
        }

        return nodeClass;
    }

    function GetNodeIcon(status) {
        var nodeIcon;
        switch (status) {
            case $rootScope.getWord("Available"):
                nodeIcon = "fa fa-check-square-o";
                break;

            case $rootScope.getWord("Occupied"):
                nodeIcon = "fa fa-spinner fa-spin";
                break;

            case $rootScope.getWord("Under Maintenance"):
                nodeIcon = "fa fa-exclamation-circle";
                break;

            case $rootScope.getWord("Not In Service"):
                nodeIcon = "fa fa-warning";
                break;

            default:
                nodeIcon = "fa  fa-question-circle";

                break;
        }

        return nodeIcon;
    }

    function CreateTree(groupName, testStationName, testStationStatus, testStationClass) {
        var treeNodes = new Array();

        var stations = TestStations.stations;

        var groupNames = new Array();
        var found;
        var hasGroups = false;
        var menuItem;
        // create folder items
        if (groupName) {
            for (var i = 0; i < stations.length; i++) {
                var gn = stations[i][groupName];

                found = false;
                for (var j = 0; j < groupNames.length; j++) {
                    if (groupNames[j] === gn) {
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    groupNames.push(gn);
                }
            }

            if (groupNames.length > 0) {
                hasGroups = true;

                // add gorup names as first level menus, they are not clickable
                for (var i = 0; i < groupNames.length; i++) {
                    menuItem = new Object();
                    menuItem.content = "<span><i class=\"fa fa-lg fa-plus-circle\"></i>" + groupNames[i] + "</span>";
                    menuItem.name = groupNames[i];
                    if (i === 0) {
                        menuItem.expanded = true;
                    }
                    else {
                        menuItem.expanded = true;
                    }
                    menuItem.children = new Array();

                    treeNodes.push(menuItem);
                }
            }
        }

        // create item category menu items
        for (var i = 0; i < stations.length; i++) {
            stations[i].checked = false;
            var status = stations[i][testStationStatus];
            if (!status)
            {
                status = "Unknown";
            }
            if (hasGroups) {
                for (var j = 0; j < treeNodes.length; j++) {
                    if (treeNodes[j].name === stations[i][groupName]) {
                        menuItem = new Object();
       
                        menuItem.content = "<span class=\"" + GetNodeClass(status) + "\"><i class=\"" + GetNodeIcon(stations[i][testStationStatus]) + "\" style=\"color:white\"></i>&nbsp;<a class=\"station-a\" href=\"javascript:angular.element(document.getElementById('StationsLayoutCtrl')).scope().OpenDashboard(" + i + ");\">" + stations[i][testStationName] + " (" + status + ")" + "</a></span>";
                        treeNodes[j].children.push(menuItem);
                        break;
                    }
                }
            }
            else {
                menuItem = new Object();
                menuItem.content = "<span class=\"" + GetNodeClass(status) + "\"><i class=\"" + GetNodeIcon(stations[i][testStationStatus]) + "\" style=\"color:white\"></i>&nbsp;<a class=\"station-a\" href=\"javascript:angular.element(document.getElementById('StationsLayoutCtrl')).scope().OpenDashboard(" + i + ");\">" + stations[i][testStationName] + " (" + status + ")" + "</a></span>";

                treeNodes.push(menuItem);
            }
        }

        return treeNodes;
    };

    $scope.OpenDashboard = function OpenDashboard(index) {
        var oid = TestStations.stations[index].obj_id;
        $state.go('app.stations.dashboard', { schema: $stateParams.schema, class: $stateParams.class, oid: oid, xmlschema: TestStations.params['xmlSchemaName'], index: index });
    }
});