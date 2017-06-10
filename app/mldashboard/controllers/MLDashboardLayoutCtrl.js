'use strict';

angular.module('app.mldashboard').controller('MLDashboardLayoutCtrl', function ($http, APP_CONFIG, $scope, $state, $stateParams, propmisedParams) {

    var params = propmisedParams.data;

    // url to get tree model
    var url = APP_CONFIG.ebaasRootUrl + "/api/dnn/projects";

    $http.get(url).then(function (res) {

        var projectData = res.data;

        if (projectData) {

            $scope.modelTree = createProjectTree(projectData);
        }
    });

    $scope.OpenModelDashboard = function(project, model) {
        $state.go('app.mldashboard.modeldashboard', { project: project, model: model});
    }

    var addModelItems = function (parentItem, project, models)
    {
        var model, modelItem;

        if (models) {
            for (var i = 0; i < models.length; i += 1) {
                model = models[i];
                modelItem = {};
                modelItem.title = model;
                modelItem.content = "<span class='label label-info'><a class=\"station-a\" href=\"javascript:angular.element(document.getElementById('modelTree')).scope().OpenModelDashboard('" + project + "', '" + model + "');\">" + model + "</a></span>";

                parentItem.children.push(modelItem);
            }
        }
    }

    function createProjectTree(projects) {
        var roots = [];

        // add models to the project
        asyncLoop({
            length: projects.length,
            functionToLoop: function (loop, i) {
                $http.get(APP_CONFIG.ebaasRootUrl + "/api/dnn/models/" + projects[i])
                     .success(function (data) {

                         var project = projects[i];
                         var projectItem = {};
                         projectItem.title = project;
                         projectItem.content = "<span><i class=\"fa fa-lg fa-plus-circle\"></i> " + project + "</span>";
                         projectItem.children = [];
                         projectItem.expanded = true;
                         roots.push(projectItem);

                         addModelItems(projectItem, project, data);

                         loop();
                     });
            },
            callback: function () {
            }
        });

        return roots;
    }

    var asyncLoop = function (o) {
        var i = -1;

        var loop = function () {
            i++;
            if (i == o.length) {
                o.callback();
                return;
            }

            o.functionToLoop(loop, i);
        }

        loop(); // init
    }
})