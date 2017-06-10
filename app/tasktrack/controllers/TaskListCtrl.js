'use strict';

angular.module('app.tasktrack').controller('TaskListCtrl', function ($scope, $state, $rootScope, $stateParams, taskTrackService, hubService) {

    $scope.dbschema = $stateParams.schema;
    $scope.taskclass = $stateParams.class;
    $scope.pickoid = $stateParams.pickoid;
    $scope.template = "IssueForm.htm";

    $scope.displayed = [];

    $scope.isLoading = true;

    $scope.tableState;

    $scope.callServer = function callServer(tableState) {

        $scope.isLoading = true;

        $scope.tableState = tableState;

        if (!$scope.pickoid) {
            var pagination = tableState.pagination;

            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.

            taskTrackService.getTaskResult($scope.dbschema, $scope.taskclass, start, number, tableState, function (result) {
                $scope.displayed = result.data;
         
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.isLoading = false;
            });
        }
        else
        {
            taskTrackService.getOneTask($scope.dbschema, $scope.taskclass, $scope.pickoid, function (result) {
                $scope.displayed = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.isLoading = false;
            });
         }
    };

    $scope.searchIssues = function () {

    }

    $scope.switchTrackStatus = function (row) {
        var groupName = $scope.dbschema + "-" + row.type + "-" + row.obj_id;

        if (row.TrackStatus)
        {
            hubService.addToGroup(groupName); // hubService adds the current user to the group
        }
        else
        {
            hubService.removeFromGroup(groupName); // hubService removes the current user from the group
        }
    }

    $rootScope.$on('modalClosed', function (event, data) {
        if (data === "update") {
            $scope.callServer($scope.tableState);
        }
    });
});