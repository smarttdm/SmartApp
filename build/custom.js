'use strict';

/**
 * Custom module of the application.
 */

angular.module('app.custom', [
    'app.custom.tasktrack'
]);

angular.module("app.custom").config(function ($stateProvider) {
    $stateProvider
        .state('app.custom', {
            abstract: true,
            data: {
                title: 'custom',
            }
        });
});



"use strict";

angular.module("app.custom.tasktrack", ["ui.router", "ui.bootstrap"]);

angular.module("app.custom.tasktrack").config(function ($stateProvider, modalStateProvider) {

    $stateProvider
        .state('app.custom.tasktrack', {
            abstract: true,
            data: {
                title: 'Task Track',
            }
        })
        .state('app.custom.tasktrack.tasklist', {
            url: '/customtasktrack/tasklist/:schema/:class/:pickoid',
            data: {
                title: 'Task List',
            },
            views: {
                "content@app": {
                    templateUrl: 'custom/tasktrack/views/task-list.html',
                    controller: 'custom.TaskListCtrl'
                }
            }
        });

    modalStateProvider.state('app.custom.tasktrack.tasklist.modalform', {
        url: '^/issuemodalform/:schema/:class/:oid/:template/:formAttribute',
        templateUrl: "app/smartforms/views/ebaas-form-modal.html",
        controller: 'ebaasFormModalCtrl',
        backdrop: 'static', /*  this prevent user interaction with the background  */
        keyboard: false,
        animation: false,
        size: 'lg'
    });
});
angular.module("app.custom").run(["$templateCache", function($templateCache) {$templateCache.put("custom/tasktrack/views/task-list.html","<div id=\"content\">\r\n    <div class=\"row\">\r\n        <big-breadcrumbs items=\"[getWord(\'Home\'), getWord(\'Issue Tracking\')]\" class=\"col-xs-12 col-sm-12\"></big-breadcrumbs>\r\n    </div>\r\n    <!--\r\n        The ID \"widget-grid\" will start to initialize all widgets below\r\n        You do not need to use widgets if you dont want to. Simply remove\r\n        the <section></section> and you can use wells or panels instead\r\n        -->\r\n    <!-- widget grid -->\r\n    <section id=\"widget-grid\" data-widget-grid>\r\n        <!-- row -->\r\n        <div class=\"row\">\r\n            <!-- NEW WIDGET START -->\r\n            <article class=\"col-xs-12 col-sm-12\">\r\n                <!-- Widget ID (each widget will need unique ID)-->\r\n                <div class=\"well\" id=\"widget-title-widget\" data-jarvis-widget>\r\n                    <!-- widget options:\r\n                        usage: <div data-jarvis-widget id=\"wid-id-0\" data-widget-editbutton=\"false\">\r\n                        data-widget-colorbutton=\"false\"\r\n                        data-widget-editbutton=\"false\"\r\n                        data-widget-togglebutton=\"false\"\r\n                        data-widget-deletebutton=\"false\"\r\n                        data-widget-fullscreenbutton=\"false\"\r\n                        data-widget-custombutton=\"false\"\r\n                        data-widget-collapsed=\"true\"\r\n                        data-widget-sortable=\"false\"\r\n                    -->\r\n                    <header></header>\r\n                    <!-- widget div-->\r\n                    <div>\r\n                        <!-- widget content -->\r\n                        <div class=\"widget-body no-padding\" data-sparkline-container>\r\n\r\n                            <table st-delay=\"1000\" st-pipe=\"callServer\" st-table=\"displayed\" class=\"table table-striped table-bordered table-hover\">\r\n                                <thead>\r\n                                    <tr>\r\n                                        <th st-sort=\"Name\">名称</th>\r\n                                        <th st-sort=\"Category\">类型</th>\r\n                                        <th st-sort=\"Progress\"><i class=\"fa fa-fw fa-clock-o text-muted hidden-md hidden-sm hidden-xs\"></i> 进度</th>\r\n                                        <th st-sort=\"Status\">状态</th>\r\n                                        <th st-sort=\"Owner\"><i class=\"fa fa-fw fa-user text-muted hidden-md hidden-sm hidden-xs\"></i>负责人</th>\r\n                                        <th st-sort=\"StartTime\">\r\n                                            <i class=\"fa fa-fw fa-calendar text-muted hidden-md hidden-sm hidden-xs\"></i>\r\n                                            开始时间\r\n                                        </th>\r\n                                        <th st-sort=\"EndTime\">\r\n                                            <i class=\"fa fa-fw fa-calendar text-muted hidden-md hidden-sm hidden-xs\"></i>\r\n                                            结束时间\r\n                                        </th>\r\n                                        <th>关注</th>\r\n                                    </tr>\r\n                                    <tr>\r\n                                        <th><input st-search=\"Name\" /></th>\r\n					<th><input st-search=\"Category\" /></th>\r\n                                        <th><input st-search=\"Progress\" /></th>\r\n                                        <th><input st-search=\"Status\" /></th>\r\n                                        <th><input st-search=\"Owner\" /></th>\r\n                                        <th></th>\r\n                                        <th></th>\r\n                                        <th></th>\r\n                                    </tr>\r\n                                </thead>\r\n                                <tbody ng-show=\"!isLoading\">\r\n                                    <tr ng-repeat=\"row in displayed\">\r\n                                        <td><a ui-sref=\'.modalform({schema: dbschema, class: taskclass, oid: row.obj_id, template: template})\'><strong>{{row.Name}}</strong></a></td>\r\n					<td>{{row.Category}}</td>\r\n                                        <td><div class=\'progress progress-xs\' data-progressbar-value=\'{{row.Progress}}\'><div class=\'progress-bar\'></div></div></td>\r\n                                        <td><span ng-class=\"row.Progress != 100 ? \'label label-success\': \'label label-default\'\">{{row.Status}}</span></td>\r\n                                        <td><a ui-sref=\'app.tasktrack.taskmessages\'><strong>{{row.Owner}}</strong></a></td>\r\n                                        <td>{{row.StartTime | date : \'shortDate\'}}</td>\r\n                                        <td>{{row.EndTime | date : \'shortDate\'}}</td>\r\n                                        <td><span class=\'onoffswitch\'><input type=\'checkbox\' name=\'trackswitch\' ng-change=\"switchTrackStatus(row)\" class=\'onoffswitch-checkbox\' id=\'{{row.ID}}\' ng-model=\"row.TrackStatus\"><label class=\'onoffswitch-label\' for=\'{{row.ID}}\'><span class=\'onoffswitch-inner\' data-swchon-text=\'ON\' data-swchoff-text=\'OFF\'></span><span class=\'onoffswitch-switch\'></span></label></span></td>\r\n                                    </tr>\r\n                                </tbody>\r\n                                <tbody ng-show=\"isLoading\">\r\n                                    <tr>\r\n                                        <td colspan=\"8\" class=\"text-center\">Loading ... </td>\r\n                                    </tr>\r\n                                </tbody>\r\n                                <tfoot>\r\n                                    <tr>\r\n                                        <td class=\"text-center\" st-pagination=\"\" st-items-by-page=\"10\" colspan=\"8\"></td>\r\n                                    </tr>\r\n                                </tfoot>\r\n                            </table>\r\n                        </div>\r\n                        <!-- end widget content -->\r\n                    </div>\r\n                    <!-- end widget div -->\r\n                </div>\r\n                <!-- end widget -->\r\n                <a class=\"btn btn-info\"  ui-sref=\".modalform({schema: dbschema, class: taskclass, oid: null, template: template})\"><i class=\"fa fa-pencil\"></i> {{getWord(\"Add Issue\")}}</a>\r\n            </article>\r\n            <!-- WIDGET END -->\r\n        </div>\r\n        <!-- end row -->\r\n    </section>\r\n    <!-- end widget grid -->\r\n</div>\r\n");}]);
'use strict';

angular.module('app.custom.tasktrack').controller('custom.TaskListCtrl', function ($scope, $stateParams, taskTrackService, hubService) {

    $scope.dbschema = $stateParams.schema;
    $scope.taskclass = $stateParams.class;
    $scope.pickoid = $stateParams.pickoid;
    $scope.template = "IssueForm.htm";

    $scope.displayed = [];

    $scope.isLoading = true;

    $scope.callServer = function callServer(tableState) {

        $scope.isLoading = true;

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
});