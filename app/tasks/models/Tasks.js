

'use strict';

angular.module('app.tasks').factory('TasksInfo', function () {

    var TaskModel = {
            count: 0,
            tasks: []
        };

    return TaskModel;
});
