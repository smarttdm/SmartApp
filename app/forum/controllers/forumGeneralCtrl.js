'use strict';

angular.module('app.forum').controller('forumGeneralCtrl', function ($scope, $rootScope, $http, $state, $stateParams, APP_CONFIG, promisedGroups, forumService) {

    $scope.dbschema = $stateParams.schema;
    $scope.dbclass = $stateParams.class;

    $scope.topicClass = "Topic";

    $scope.keywords = "";

    if ($stateParams.pageIndex) {
        $scope.pageIndex = parseInt($stateParams.pageIndex);
    }
    else {
        $scope.pageIndex = 0;
    }

    var groupCollection = promisedGroups.data;
 
    var id = "ID";
    var category = "Category";
    var name = "Name";
    var desc = "Description";
    var icon = "Icon";
    var topicQty = "TopicQty";
    var poster = "Poster";
    var postTime = "PostTime";

    var findCategory = function (category) {
        var found = undefined;

        for (var i = 0; i < $scope.categories.length; i++) {
            if ($scope.categories[i].title === category) {
                found = $scope.categories[i];

                break;
            }
        }

        return found;
    }

    // Getting popular topics
    forumService.getPopularTopics($stateParams.schema, $scope.topicClass, function (data) {
        $scope.populartopics = data;

    });

    $scope.categories = new Array();

    if (groupCollection) {
        for (var i = 0; i < groupCollection.length; i++) {
            var group = groupCollection[i];

            var categoryItem = findCategory(group[category]);
            if (!categoryItem)
            {
                categoryItem = new Object();
                categoryItem.title = group[category];
                categoryItem.groups = new Array();
                $scope.categories.push(categoryItem);
            }

            var groupItem = new Object();

            groupItem.obj_id = group["obj_id"];
            groupItem.id = group[id];
            groupItem.name = group[name];
            groupItem.desc = group[desc];
            groupItem.category = group[category];
            groupItem.icon = group[icon] + " fa-2x text-muted";
            groupItem.topicQty = group[topicQty];
            groupItem.poster = group[poster];
            groupItem.postTime = group[postTime];

            categoryItem.groups.push(groupItem);
        }
    }

    $scope.searchTopics = function () {

        $state.go('app.forum.topics', {schema: $scope.dbschema, class: $scope.dbclass, keywords: $scope.keywords });
    }
});